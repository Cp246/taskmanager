const Task = require("../models/Task");


exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.createTask = async (req, res) => {
  try {
    console.log(" Incoming Task:", req.body);
    console.log(" Authenticated User:", req.user);

    const { title, description, deadline, completed } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: "Title and deadline are required" });
    }

    const newTask = new Task({
      title,
      description,
      deadline: new Date(deadline), 
      completed: completed || false,
      user: req.user.id,
    });

    const savedTask = await newTask.save();
    console.log(" Task saved:", savedTask);
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(" Task creation error:", err.message);
    res.status(500).json({ message: "Could not create task", error: err.message });
  }
};
;

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Could not update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete task" });
  }
};
