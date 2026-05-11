const express = require('express');
const app     = express();
const PORT    = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DecodeLabs API is running!',
    version: '1.0.0',
    endpoints: {
      getAllUsers:  'GET    /api/users',
      getUserById: 'GET    /api/users/:id',
      createUser:  'POST   /api/users',
      updateUser:  'PUT    /api/users/:id',
      deleteUser:  'DELETE /api/users/:id',
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api/users`);
});