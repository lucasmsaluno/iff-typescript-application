import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const router = express.Router();
const controlador = new UsuarioController();

router.post('/criar', (req, res) => controlador.criarUsuario(req, res));

export default router;
