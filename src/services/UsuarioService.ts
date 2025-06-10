import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../models/Usuario';

export class UsuarioService {
  private repo: UsuarioRepository;

  constructor() {
    this.repo = new UsuarioRepository();
  }

  public async criarUsuario(usuario: Usuario): Promise<number> {
    // Validações básicas (poderiam ser extraídas para utilitários)
    if (!usuario.name || !usuario.email || !usuario.password) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    if (usuario.name.length < 3) {
      throw new Error('O nome deve ter no mínimo 3 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
      throw new Error('Formato de email inválido.');
    }

    if (usuario.password.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres.');
    }

    // Salva no repositório (banco)
    return this.repo.salvar(usuario);
  }
}
