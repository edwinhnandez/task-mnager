const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tasks
let tasks = [
  {
    id: '1',
    title: 'Sample Task 1',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Sample Task 2',
    status: 'completed'
  }
];

// Helper function to reset tasks (useful for testing)
const resetTasks = () => {
  tasks = [
    {
      id: '1',
      title: 'Sample Task 1',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Sample Task 2',
      status: 'completed'
    }
  ];
};

// Helper function to get tasks (for testing)
const getTasks = () => tasks;

// Helper function to set tasks (for testing)
const setTasks = (newTasks) => {
  tasks = newTasks;
};

// Routes

// GET /tasks - List all tasks
app.get('/tasks', (req, res) => {
  try {
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
});

// POST /tasks - Add a new task
app.post('/tasks', (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      status: 'pending'
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task'
    });
  }
});

// PATCH /tasks/:id/complete - Mark task as completed (Bonus feature)
app.patch('/tasks/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    tasks[taskIndex].status = 'completed';

    res.json({
      success: true,
      data: tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task'
    });
  }
});

// DELETE /tasks/:id - Delete a task (Extra feature)
app.delete('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    tasks.splice(taskIndex, 1);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy'
  });
});

module.exports = { app, resetTasks, getTasks, setTasks };

