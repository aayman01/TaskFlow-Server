import { Router } from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = Router();


// Create a new todo
router.post("/create", createTodo);

// Get all todos
router.get("/get-all", getTodos);

// Get a specific todo
router.get("/get-one/:id", getTodo);

// Update a todo
router.put("/update/:id", updateTodo);

// Delete a todo
router.delete("/delete/:id", deleteTodo);

export default router; 