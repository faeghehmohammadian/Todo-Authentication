const express = require('express');
const router = express.Router();
const fs= require("fs");
const path = require("path");
const db = require('../models/users-model');
// GET /account
router.get('/account', (req, res) => {
    res.json(db.account);
});

// GET /todos
router.get('/todos', (req, res) => {
    res.json(db.todos);
});

// GET /todo/:id
router.get('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = db.todos.find(todo => todo.id === todoId);
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    res.json(todo);
});

// POST /todo
router.post('/todo', (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        res.status(400).json({ message: 'Title is required' });
        return;
    }
    const newTodo = {
        id: db.todos.length + 1,
        title,
        completed,
    };
    db.todos.push(newTodo);
    res.json(newTodo);
});

// PUT /todo/:id
router.put('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const { title, completed } = req.body;
    const todo = db.todos.find(todo => todo.id === todoId);
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    todo.title = title || todo.title;
    todo.completed = completed || todo.completed;
    res.json(todo);
});

// DELETE /todo/:id
router.delete('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = db.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    db.todos.splice(todoIndex, 1);
    res.json({ message: 'Todo deleted' });
});

module.exports = router;