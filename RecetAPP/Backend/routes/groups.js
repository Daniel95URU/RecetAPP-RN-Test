const express = require('express');
const Group = require('../models/Group');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Crear grupo (protegido)
router.post('/', authMiddleware, async (req, res) => {
  const { name, recipes } = req.body;

  try {
    const newGroup = new Group({ name, recipes });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los grupos (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find().populate('recipes');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar grupo (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Grupo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
