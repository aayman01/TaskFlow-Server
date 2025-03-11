import Todo from "../models/todo.js";

// Create a new todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const todo = new Todo({
      title,
      description,
      dueDate,
      status,
      user: req.user._id,
    });

    await todo.save();
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    res.status(500).json({ error: "Error creating todo", message: error.message });
  }
};

// Get all todos for a user
export const getTodos = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todos", message: error.message });
  }
};

// Get a specific todo
export const getTodo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error fetching todo", message: error.message });
  }
};

// Update a todo
export const updateTodo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, description, dueDate, status } = req.body;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title,
        description,
        dueDate,
        status,
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    res.status(500).json({ error: "Error updating todo", message: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting todo", message: error.message });
  }
}; 