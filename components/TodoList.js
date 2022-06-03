import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { db } from "../firebase";
import Todo from "./Todo";

const TodoList = ({ todosProps }) => {
  const [todos, setTodos] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    setTodos(JSON.parse(todosProps));
  }, []);

  useEffect(() => {
    const colRef = collection(db, "todos");

    const q = query(
      colRef,
      where("email", "==", currentUser?.email),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate().getTime(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <div>
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            id={todo.id}
            title={todo.title}
            detail={todo.detail}
            timestamp={todo.timestamp}
          />
        ))}
      </div>
    </>
  );
};

export default TodoList;
