import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json()); // Permite que o servidor entenda JSON

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ message: 'Olá do backend CeFoods!' });
});

// Futuras rotas para produtos, usuários, etc.
import productRoutes from './routes/products.js';
app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
