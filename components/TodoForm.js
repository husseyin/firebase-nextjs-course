import { Button, TextField } from "@mui/material";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth";
import { db } from "../firebase";
import { TodoContext } from "../pages/TodoContext";

const TodoForm = () => {
  const inputAreaRef = useRef();

  const { showAlert, todo, setTodo } = useContext(TodoContext);
  const { currentUser } = useAuth();

  const onSubmit = async () => {
    if (todo?.hasOwnProperty("timestamp")) {
      //update the todo
      const docRef = doc(db, "todos", todo.id);
      const todoUpdated = { ...todo, timestamp: serverTimestamp() };
      updateDoc(docRef, todoUpdated);

      setTodo({ title: "", detail: "" });
      showAlert("info", `Todo with id ${todo.id} updated successfully`);
    } else {
      //add the todo
      const colRef = collection(db, "todos");
      const docRef = await addDoc(colRef, {
        ...todo,
        email: currentUser.email,
        timestamp: serverTimestamp(),
      });

      setTodo({ title: "", detail: "" });
      showAlert("success", `Todo with id ${docRef.id} is added successfully`);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log("Outside input area");
        setTodo({ title: "", detail: "" });
      } else {
        console.log("Inside input area");
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  return (
    <div ref={inputAreaRef}>
      {/* <pre>{JSON.stringify(todo, null, "\t")}</pre> */}

      <TextField
        fullWidth
        label="title"
        margin="normal"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <TextField
        fullWidth
        label="detail"
        multiline
        maxRows={4}
        value={todo.detail}
        onChange={(e) => setTodo({ ...todo, detail: e.target.value })}
      />
      <Button variant="contained" sx={{ mt: 3 }} onClick={onSubmit}>
        {todo.hasOwnProperty("timestamp") ? "Update todo" : "Add a new Todo"}
      </Button>
    </div>
  );
};

export default TodoForm;
