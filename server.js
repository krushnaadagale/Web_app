const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
let todos = [
  { id: 1, task: 'Learn Node.js', done: false },
  { id: 2, task: 'Build an API', done: false },
  { id: 3, task: 'Set up CI/CD pipeline 🚀', done: false },
];
let nextId = 4;

// Routes

// GET /  — Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /todos  — List all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET /todos/:id  — Get a single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST /todos  — Create a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  const newTodo = { id: nextId++, task, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id  — Update a todo
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  const { task, done } = req.body;
  if (task !== undefined) todo.task = task;
  if (done !== undefined) todo.done = done;

  res.json(todo);
});

// DELETE /todos/:id  — Delete a todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  todos.splice(index, 1);
  res.json({ message: 'Todo deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});