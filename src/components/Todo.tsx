/** @format */
"use client";

// dropzone
import { useDropzone, FileRejection, FileWithPath } from "react-dropzone";

// dropzone  end
import React, { useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import SingleTodo from "./SingleTodo";
import { cn } from "@/utils";

type Props = {};

export type TodoType = {
  id: number;
  text: string;
  isCompleted: boolean;
};

export default function TodoApp({}: Props) {
  // dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: FileWithPath[]) => handleFileDrop(acceptedFiles)
  });

  const handleFileDrop = (files: File[]) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      // Assuming the content of the text file is a newline-separated list of todos
      const newTodos = content.split("\n").map((text, index) => ({
        id: index + 1,
        text: text.trim(),
        isCompleted: false
      }));

      setTodos((prevTodos) => [...prevTodos, ...newTodos]);
    };

    if (files.length > 0) {
      reader.readAsText(files[0]);
    }
  };

  // dropzone end **

  const [animationParent] = useAutoAnimate();
  const [todos, setTodos] = useState<TodoType[]>([
    { id: 1, text: "Todo 1", isCompleted: false },
    { id: 2, text: "Todo 2", isCompleted: false },
    { id: 3, text: "Todo 3", isCompleted: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [editeModeId, setEditeIdMode] = useState<number | null>(null);
  const [textValue, setTextValue] = useState("");

  function addTodo() {
    if (inputText.trim() !== "") {
      const isExistingTodo = todos.some((todo) => todo.text === inputText);

      if (isExistingTodo) {
        alert("This todo already exists!");
        setInputText("");
        return;
      }
      const newTodo: TodoType = {
        id: todos.length + 1,
        text: inputText,
        isCompleted: false
      };

      setTodos([...todos, newTodo]);
      setInputText("");
    }
  }

  function deleteTodo(id: number) {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);
  }

  function editTodo(id: number) {
    setEditeIdMode(id);

    const todoToEdit = todos.find((todo) => todo.id == id);
    if (todoToEdit) {
      setTextValue(todoToEdit.text);
    }
  }

  function saveEditedTodo() {
    const updatedTodos = todos.map((todo) =>
      todo.id === editeModeId ? { ...todo, text: textValue } : todo
    );

    setTodos(updatedTodos);
    setEditeIdMode(null);
  }

  //  handle compolete todo or not
  function handleIsTodoCompeted(task: TodoType) {
    const updatedTodos = todos.map((d) => {
      console.log("circle clicked");
      if (task == d) {
        return { ...d, isCompleted: !d.isCompleted };
      }
      return d;
    });

    setTodos(updatedTodos);
  }
  console.log("todos-", todos);

  function clearCompletedTodos() {
    const updatedTodos = todos.filter((todo) => !todo.isCompleted);
    setTodos(updatedTodos);
  }

  const unCheckedTodos = todos.filter((d) => !d.isCompleted);
  const checkedTodos = todos.filter((d) => d.isCompleted);

  return (
    <div className="container mx-auto max-w-md p-4 flex flex-col gap-3">
      <h2 className="text-2xl font-bold mb-4">Todo App</h2>
      <div className="flex mb-4">
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          type="text"
          placeholder="Add a todo..."
          className="border-gray-300 border rounded-l px-4 py-2 w-full"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>
      <ul ref={animationParent}>
        {todos.map((todo, i) => (
          <SingleTodo
            className={cn({ "border-none": todos.length - 1 === i })}
            handleIsTodoCompeted={() => handleIsTodoCompeted(todo)}
            deleteTodo={() => deleteTodo(todo.id)}
            editTodo={() => editTodo(todo.id)}
            editeModeId={editeModeId}
            saveEditedTodo={saveEditedTodo}
            setTextValue={setTextValue}
            textValue={textValue}
            todo={todo}
            key={i}
          />
        ))}
      </ul>
      {checkedTodos.length > 0 && (
        <button
          onClick={clearCompletedTodos}
          className="bg-red-500 text-white px-4 py-2 mt-4"
        >
          Clear Completed Todos
        </button>
      )}
      {/* drop zone
       */}
      <div
        {...getRootProps()}
        className="dropzone cursor-grab border-dashed border-2 border-gray-300 p-6 text-center"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {` Drag 'n' drop a text file with todos here, or click to select a file`}
        </p>
      </div>
    </div>
  );
}
