import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/products - Rota para buscar todos os produtos
router.get('/', async (req, res) => {
  try {
    // A query SQL é a mesma, mas a forma de obter o resultado muda.
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
