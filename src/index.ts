import express from 'express';
import cors from 'cors';
import usuarioRotas from './routes/usuario.routes';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('Olá, Mundo! Bem-vindo ao Express com TypeScript.');
});

app.use('/usuarios', usuarioRotas);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
