import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import QRCode from 'qrcode';

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json()); // Permite que o servidor entenda JSON

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ message: 'Olá do backend CeFoods!' });
});

// Rota para a raiz do servidor
app.get('/', (req, res) => {
  res.send('<h2>Bem-vindo ao backend CeFoods!<br>Use <a href="/qrcode">/qrcode</a> para gerar o QR code.</h2>');
});

// Futuras rotas para produtos, usuários, etc.
import productRoutes from './routes/products.js';
app.use('/api/products', productRoutes);
// Endpoint para gerar QR code
app.get('/qrcode', async (req, res) => {
  const url = 'http://192.168.100.7:3001'; // Troque pelo IP local do seu PC
  try {
    const src = await QRCode.toDataURL(url);
    res.send(`<img src="${src}">`);
  } catch (err) {
    res.send('Erro ao gerar QR code');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Nodemon dev script
// "dev": "nodemon server/index.js"
