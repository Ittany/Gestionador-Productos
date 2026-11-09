const pool = require('../config/db');

// 1. GET (Listar todos)
const listarProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

// 2. POST (Crear)
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion = null, precio, stock = 0 } = req.body;
    
    if (!nombre || precio === undefined) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre.trim(), descripcion, Number(precio), Number(stock)]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      precio,
      stock
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// 3. PUT (Actualizar)
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    
    // Actualización simple para que funcione rápido
    const [result] = await pool.execute(
      'UPDATE productos SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), precio = COALESCE(?, precio), stock = COALESCE(?, stock) WHERE id = ?',
      [nombre, descripcion, precio, stock, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json({ mensaje: 'Actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

// 4. DELETE (Eliminar)
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(200).json({ mensaje: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

module.exports = { listarProductos, crearProducto, actualizarProducto, eliminarProducto };