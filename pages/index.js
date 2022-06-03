import { Alert, Avatar, IconButton, Snackbar, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useState } from "react";
import { useAuth } from "../Auth";
import Loading from "../components/Loading";
import Login from "../components/Login";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { auth, db } from "../firebase";
import { TodoContext } from "./TodoContext";
import nookies from "nookies";
import { verifyIdToken } from "../firebaseAdmin";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default function Home({ todosProps }) {
  const { currentUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [todo, setTodo] = useState({ title: "", detail: "" });

  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <TodoContext.Provider value={{ showAlert, todo, setTodo }}>
        <Container maxWidth="sm">
          <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={3}>
            <IconButton onClick={() => auth.signOut()}>
              <Avatar src={currentUser.photoURL} />
            </IconButton>
            <Typography variant="h5">{currentUser.displayName}</Typography>
          </Box>
          <TodoForm />
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={alertType}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
          <TodoList todosProps={todosProps} />
        </Container>
      </TodoContext.Provider>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { uid, email } = token;
    const colRef = collection(db, "todos");
    const q = query(
      colRef,
      where("email", "==", email),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    let todos = [];
    snapshot.forEach((doc) => {
      todos.push({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp.toDate().getTime(),
      });
    });

    return {
      props: {
        todosProps: JSON.stringify(todos) || [],
      },
    };
  } catch (error) {
    return { props: {} };
  }
}
