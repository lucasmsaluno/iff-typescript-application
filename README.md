# iff-architecture-program-javascript-server

---

## 🧠 Objetivo

Criar uma API simples para **cadastrar usuários**, utilizando:

- **Express** (servidor web)
- **TypeScript** (tipagem e organização do código)
- **SQLite** (banco de dados leve)
- Arquitetura modular com separação por responsabilidade

---

## 📁 Estrutura do Projeto

```
src/
├── index.ts                      # Arquivo principal (server)
├── controladora/
│   └── ControladorUsuario.ts     # Controller responsável pelas regras de negócio
├── bancodados/
│   └── database.ts               # Conexão e operações com o banco de dados
```

---

## 🚀 Etapas do Funcionamento da API

### 1. `src/index.ts` – **Servidor**

```ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { ControladorUsuario } from './controladora/ControladorUsuario';

const app = express();
app.use(express.json());
app.use(cors());

// Rota inicial de teste
app.get('/', (req: Request, res: Response) => {
  res.send('Olá, Mundo! Bem-vindo ao Express com TypeScript.');
});

// Cria uma instância do controlador e define rota para criar usuário
const controladorUsuario = new ControladorUsuario();
app.post('/criar-usuario', (req, res) => {
  controladorUsuario.criarUsuario(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

📌 **Responsabilidades do `index.ts`:**

| Função                         | Descrição                      |
| ------------------------------ | ------------------------------ |
| Iniciar servidor               | Chama `app.listen()`           |
| Configurar middlewares globais | JSON e CORS                    |
| Definir rotas                  | Usa `app.post()` e `app.get()` |
| Instanciar o controller        | Para repassar requisições      |

---

### 2. `src/controladora/ControladorUsuario.ts` – **Controller**

```ts
import { Request, Response } from 'express';
import { saveUserToDatabase } from '../bancodados/database';

export class ControladorUsuario {
  public async criarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validações (regra de negócio)
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
        return;
      }

      if (name.length < 3) {
        res.status(400).json({ error: 'O nome deve ter no mínimo 3 caracteres.' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Formato de email inválido.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
      }

      // Chama a persistência no banco
      const result = await saveUserToDatabase(name, email, password);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

📌 **Responsabilidades do Controller:**

| Função                        | Descrição                  |
| ----------------------------- | -------------------------- |
| Receber requisição            | Usa `req.body`             |
| Aplicar regras de negócio     | Valida nome, email, senha  |
| Chamar camada de persistência | Usa `saveUserToDatabase()` |
| Enviar resposta adequada      | Usa `res.status().json()`  |

---

### 3. `src/bancodados/database.ts` – **Persistência**

```ts
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

// Cria a tabela, se não existir
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT
)`);

// Função para salvar um usuário no banco
export function saveUserToDatabase(name: string, email: string, password: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}
```

📌 **Responsabilidades da camada de banco de dados:**

| Função                        | Descrição                     |
| ----------------------------- | ----------------------------- |
| Criar tabela (se necessário)  | Usa `db.run()`                |
| Inserir usuário no banco      | Função `saveUserToDatabase()` |
| Retornar ID do usuário criado | Usa `this.lastID`             |

---

## ✅ Próximos Passos (Para Evoluir)

1. **Separar as regras de negócio em uma classe `UseCase`**.
2. **Criar uma `Entity` para representar o usuário e encapsular validações.**
3. **Criar um `Repository` para separar a lógica de acesso ao banco.**

---

## 🔁 Comparativo entre Arquiteturas

| Camada     | Arquitetura Atual (Simples)           | Arquitetura em Camadas (Melhor)                   |
| ---------- | ------------------------------------- | ------------------------------------------------- |
| Server     | Inicia, configura rotas e middlewares | Apenas inicia e orquestra módulos                 |
| Rota       | N/A                                   | Mapeia endpoints e instancia controller + serviço |
| Controller | Aplica regra de negócio e responde    | Só recebe req/res e chama o `UseCase`             |
| UseCase    | N/A                                   | Orquestra validações e persistência               |
| Entity     | N/A                                   | Contém regras de domínio (ex: validar nome/email) |
| Repository | N/A                                   | Camada que abstrai o acesso ao banco de dados     |
| Database   | Função de persistência simples        | Só configuração de conexão (infraestrutura)       |

# Exercício:

---

## 🎯 **Objetivo**

Organizar o projeto em **camadas (layers)** para tornar o código mais escalável, legível, reutilizável e fácil de manter, seguindo o padrão de arquitetura em camadas com separação em:

- **Controller** (entrada e saída)
- **Service** (regra de negócio)
- **Repository** (acesso ao banco de dados)
- **Model** (estrutura da entidade)
- **Routes** (configuração das rotas)

---

## 🗂️ Estrutura Final de Pastas

```
src/
│
├── routes/
│   └── usuario.routes.ts
│
├── controllers/
│   └── UsuarioController.ts
│
├── services/
│   └── UsuarioService.ts
│
├── repositories/
│   └── UsuarioRepository.ts
│
├── models/
│   └── Usuario.ts
│
├── database/
│   └── sqlite.ts
│
├── index.ts
```

```
src/
├── routes/
│   └── usuario.routes.ts           # Define rotas relacionadas ao usuário
├── controllers/
│   └── UsuarioController.ts        # Controlador para regras de entrada e saída
├── services/
│   └── UsuarioService.ts           # Lógica e regras de negócio
├── repositories/
│   └── UsuarioRepository.ts        # Acesso aos dados do usuário no banco
├── models/
│   └── Usuario.ts                  # Modelo da entidade usuário
├── database/
│   └── sqlite.ts                   # Configuração do banco de dados
├── index.ts                       # Arquivo principal que inicia o servidor
```

Transformar o backend atual em um projeto organizado com as seguintes camadas:

| Camada         | Responsabilidade                                         |
| -------------- | -------------------------------------------------------- |
| **Routes**     | Configuração e definição das rotas HTTP                  |
| **Controller** | Recebe requisições e retorna respostas (entrada/saída)   |
| **Service**    | Contém as regras de negócio e lógica da aplicação        |
| **Repository** | Responsável pelo acesso e manipulação dos dados no banco |
| **Model**      | Define a estrutura das entidades (ex: Usuário)           |
| **Database**   | Configura conexão e operações do banco de dados          |

---

## ✅ Passo a Passo

---

### 1. 📦 Criar o model (`models/Usuario.ts`)

```ts
// src/models/Usuario.ts
export interface Usuario {
  id?: number;
  name: string;
  email: string;
  password: string;
}
```

---

### 2. 🗃️ Repositório (`repositories/UsuarioRepository.ts`)

```ts
// src/repositories/UsuarioRepository.ts
import { Usuario } from '../models/Usuario';
import { db } from '../database/sqlite';

export class UsuarioRepository {
  async salvar(usuario: Usuario): Promise<number> {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [usuario.name, usuario.email, usuario.password], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
}
```

---

### 3. 🧠 Serviço (`services/UsuarioService.ts`)

```ts
// src/services/UsuarioService.ts
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../models/Usuario';

export class UsuarioService {
  private usuarioRepository = new UsuarioRepository();

  async criarUsuario(usuario: Usuario): Promise<number> {
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

    const id = await this.usuarioRepository.salvar(usuario);
    return id;
  }
}
```

---

### 4. 🎮 Controlador (`controllers/UsuarioController.ts`)

```ts
// src/controllers/UsuarioController.ts
import { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';

export class UsuarioController {
  private usuarioService = new UsuarioService();

  public async criarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const id = await this.usuarioService.criarUsuario({ name, email, password });
      res.status(201).json({ id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

---

### 5. 🌐 Rotas (`routes/usuario.routes.ts`)

```ts
// src/routes/usuario.routes.ts
import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';

const router = Router();
const usuarioController = new UsuarioController();

router.post('/criar-usuario', (req, res) => usuarioController.criarUsuario(req, res));

export default router;
```

---

### 6. 🧱 Banco de Dados (`database/sqlite.ts`)

```ts
// src/database/sqlite.ts
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  password TEXT
)`);
```

---

### 7. 🚀 Arquivo principal (`index.ts`)

```ts
// src/index.ts
import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Olá, Mundo! Bem-vindo ao Express com TypeScript.');
});

app.use('/', usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

## ✅ Benefícios dessa estrutura

- **Organização:** cada camada tem uma responsabilidade clara.
- **Facilidade de testes:** você pode testar serviços sem depender do banco de dados.
- **Escalabilidade:** mais fácil adicionar novas funcionalidades e rotas.
- **Boas práticas de SOLID:** especialmente o princípio da responsabilidade única (SRP).

---

# Exercício:

### 🟢 Abordagem recomendada (regra no domínio):

1. **Entidade `Usuario` valida a si mesma.**
2. `UsuarioService` apenas orquestra e delega.

---

## ✅ Como aplicar isso no seu projeto

### 1. Atualize o `models/Usuario.ts` para ser uma **classe com regras internas**

```ts
// src/models/Usuario.ts
export class Usuario {
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;

  constructor(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }
    if (name.length < 3) {
      throw new Error('O nome deve ter no mínimo 3 caracteres.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Formato de email inválido.');
    }
    if (password.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres.');
    }

    this.name = name;
    this.email = email;
    this.password = password;
  }
}
```

---

### 2. O `UsuarioService` agora só **instancia e delega**:

```ts
// src/services/UsuarioService.ts
import { Usuario } from '../models/Usuario';
import { UsuarioRepository } from '../repositories/UsuarioRepository';

export class UsuarioService {
  private usuarioRepository = new UsuarioRepository();

  async criarUsuario(dados: { name: string; email: string; password: string }): Promise<number> {
    const usuario = new Usuario(dados.name, dados.email, dados.password);
    return await this.usuarioRepository.salvar(usuario);
  }
}
```

---

## ✅ Vantagens desse modelo

| Item                | Descrição                                                            |
| ------------------- | -------------------------------------------------------------------- |
| 💡 Responsabilidade | Cada classe faz só o que deve: `Usuario` cuida de si mesmo.          |
| 🔁 Reutilização     | Pode usar `Usuario` em testes, outros serviços, sem duplicar regras. |
| 🧪 Testável         | Fica fácil escrever testes unitários só para a entidade.             |
| 📦 Enxuto           | `Service` vira só um orquestrador, sem lógica de negócio embutida.   |

---
