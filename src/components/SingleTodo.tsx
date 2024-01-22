/** @format */

import React from "react";
import { TodoType } from "./Todo";
import { cn } from "@/utils";

type Props = {
  textValue: string;
  editeModeId: number | null;
  saveEditedTodo: () => void;
  todo: TodoType;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  editTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  handleIsTodoCompeted: (task: TodoType) => void;
  className?: string;
};

export default function SingleTodo({
  textValue,
  editeModeId,
  saveEditedTodo,
  setTextValue,
  todo,
  deleteTodo,
  editTodo,
  handleIsTodoCompeted,
  className
}: Props) {
  return (
    <li
      className={cn("flex items-center  border-b py-2 w-full gap-4", className)}
    >
      <button onClick={() => handleIsTodoCompeted(todo)}>
        <div
          className={cn("h-5 w-5 border-2 bg-gray-200 rounded-full", {
            "bg-blue-500": todo.isCompleted
          })}
        />
      </button>
      <div className="flex items-center justify-between  py-2 w-full">
        {editeModeId === todo.id ? (
          <>
            <input
              onChange={(e) => setTextValue(e.target.value)}
              value={textValue}
              type="text"
              className="border-gray-300 border rounded-l px-4 py-2 w-full "
            />
            <button
              onClick={saveEditedTodo}
              className="bg-green-500 text-white px-4 py-2 rounded-r"
            >
              Save
            </button>
          </>
        ) : (
          <>
            {/* todd, edite btn, delete btn */}
            <span>{todo.text} </span>

            <div>
              <button
                onClick={() => editTodo(todo.id)}
                className=" text-yellow-500 mr-2"
              >
                {" "}
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className=" text-red-500 "
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
