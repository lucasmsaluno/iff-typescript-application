import { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';
import { Usuario } from '../models/Usuario';

export class UsuarioController {
  private service: UsuarioService;

  constructor() {
    this.service = new UsuarioService();
  }

  public async criarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario: Usuario = req.body;
      const id = await this.service.criarUsuario(usuario);
      res.status(201).json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
