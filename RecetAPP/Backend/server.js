require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const groupRoutes = require('./routes/groups');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);

app.delete("/users/:id", async (req, res) => {
  try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en recetapp-production.up.railway.app`);
});