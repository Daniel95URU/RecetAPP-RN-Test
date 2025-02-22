const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, comensales, tiempo, ingredientes, pasos } = req.body;

    if (!nombre || !descripcion || !comensales || !tiempo || !ingredientes || !pasos) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let parsedIngredientes, parsedPasos;
    try {
      parsedIngredientes = JSON.parse(ingredientes);
      parsedPasos = JSON.parse(pasos);
    } catch (error) {
      return res.status(400).json({ error: 'Error al parsear los campos JSON: ' + error.message });
    }

    const receta = new Recipe({
      nombre,
      descripcion,
      comensales,
      tiempo,
      ingredientes: parsedIngredientes,
      pasos: parsedPasos,
      imagen: req.file ? req.file.path : null,
    });

    await receta.save();
    res.status(201).json({ mensaje: 'Receta agregada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar la receta: ' + error.message });
  }
});

router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, comensales, tiempo, ingredientes, pasos } = req.body;

    let receta = await Recipe.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    let parsedIngredientes, parsedPasos, parsedGroups;
    try {
      parsedIngredientes = ingredientes ? JSON.parse(ingredientes) : receta.ingredientes;
      parsedPasos = pasos ? JSON.parse(pasos) : receta.pasos;
      parsedGroups = groups ? JSON.parse(groups) : receta.groups;
    } catch (error) {
      return res.status(400).json({ error: 'Error al parsear los campos JSON: ' + error.message });
    }

    receta.nombre = nombre || receta.nombre;
    receta.descripcion = descripcion || receta.descripcion;
    receta.comensales = comensales || receta.comensales;
    receta.tiempo = tiempo || receta.tiempo;
    receta.ingredientes = parsedIngredientes;
    receta.pasos = parsedPasos;

    // revisa si puedes arreglar lo de la imagen doctorísimo Vargas
    if (req.file) {
      receta.imagen = req.file.path;
    }

    await receta.save();
    res.json({ mensaje: 'Receta actualizada exitosamente', receta });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la receta: ' + error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    console.log(`Fetching receta with ID: ${req.params.id}`);
    const receta = await Recipe.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const recetas = await Recipe.find();
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;