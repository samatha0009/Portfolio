const express = require('express');
const router  = express.Router();

let users = [
  { id: 1, name: 'Samatha',  email: 'samatha@example.com',  role: 'admin',  age: 22 },
  { id: 2, name: 'Ravi',     email: 'ravi@example.com',     role: 'intern', age: 20 },
  { id: 3, name: 'Priya',    email: 'priya@example.com',    role: 'intern', age: 21 },
];

let nextId = 4;

function validateUser(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name is required and must be a string');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Email format is invalid');
    }
  }

  if (!data.age || typeof data.age !== 'number') {
    errors.push('Age is required and must be a number');
  } else if (data.age < 18 || data.age > 60) {
    errors.push('Age must be between 18 and 60');
  }

  if (data.role && !['admin', 'intern', 'mentor'].includes(data.role)) {
    errors.push('Role must be admin, intern, or mentor');
  }

  return errors;
}

// GET all users
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count:   users.length,
    data:    users
  });
});

// GET single user
router.get('/:id', (req, res) => {
  const id   = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with id ${id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data:    user
  });
});

// POST create user
router.post('/', (req, res) => {
  const { name, email, role = 'intern', age } = req.body;

  const errors = validateUser({ name, email, role, age });
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  errors
    });
  }

  const emailExists = users.find(u => u.email === email);
  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists'
    });
  }

  const newUser = {
    id:    nextId++,
    name:  name.trim(),
    email: email.toLowerCase(),
    role,
    age
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data:    newUser
  });
});

// PUT update user
router.put('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `User with id ${id} not found`
    });
  }

  const { name, email, role, age } = req.body;

  const errors = validateUser({
    name:  name  || users[index].name,
    email: email || users[index].email,
    role:  role  || users[index].role,
    age:   age   || users[index].age
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  errors
    });
  }

  users[index] = {
    ...users[index],
    name:  name  ? name.trim()         : users[index].name,
    email: email ? email.toLowerCase() : users[index].email,
    role:  role  || users[index].role,
    age:   age   || users[index].age
  };

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data:    users[index]
  });
});

// DELETE user
router.delete('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `User with id ${id} not found`
    });
  }

  const deleted = users.splice(index, 1);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data:    deleted[0]
  });
});

module.exports = router;