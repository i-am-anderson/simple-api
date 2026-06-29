### 1. Configuração Inicial e Dependências

Crie a pasta do seu projeto, abra o terminal nela e inicie o Node:

```bash
npm init -y

```

Instale as dependências principais que você solicitou:

```bash
npm install cors express sqlite3

```

Instale as dependências de desenvolvimento para o TypeScript e o Nodemon funcionarem em conjunto:

```bash
npm install -D tsx typescript @types/cors @types/express @types/node @types/sqlite3

```

Inicie a configuração do TypeScript:

```bash
npx tsc --init

```

_(Dica: No arquivo `tsconfig.json` gerado, certifique-se de que `"outDir": "./dist"` e `"rootDir": "./src"` estejam descomentados para manter a organização). Altere "verbatimModuleSyntax" para false_

### 2. Estrutura de Pastas (MVC)

Crie a seguinte estrutura dentro da raiz do seu projeto. O padrão MVC separa a configuração, o acesso a dados (Models), as regras de requisição (Controllers) e os caminhos da API (Routes).

```text
📦simple-api
 ┣ 📂src
 ┃ ┣ 📂config
 ┃ ┃ ┗ 📜database.ts
 ┃ ┣ 📂controllers
 ┃ ┃ ┃ 📜index.ts
 ┃ ┃ ┗ 📜ColorController.ts
 ┃ ┣ 📂middleware
 ┃ ┃ ┗ 📜validateHexColor.ts
 ┃ ┣ 📂models
 ┃ ┃ ┃ 📜index.ts
 ┃ ┃ ┗ 📜ColorModel.ts
 ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜ColorRoute.ts
 ┃ ┣ 📂types
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜consoleColors.ts
 ┃ ┗ 📜server.ts
 ┣ 📜.gitignore
 ┣ 📜api.http
 ┣ 📜database.sqlite
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜README.md
 ┣ 📜tsconfig.json
 ┗ 📜yarn.lock
```

```text
                  ColorController.ts
                          ↑
server.ts → ROUTES → CONTROLLERS → MODELS → database.ts
              ↓                      ↓
        ColorRoute.ts          ColorModel.ts
```

---

### 3. Arquivos de Exemplo

#### `server.ts`

```typescript
import express from "express";
import cors from "cors";
import { userRoutes } from "./routes";
import { consoleColors } from "./utils/consoleColors";

const app = express();
const PORT = process.env.PORT || 3600;
const { BOLD_CYAN, RESET } = consoleColors;

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// Rotas
app.use("/api/v1", userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Running in ${BOLD_CYAN}http://localhost:${PORT}${RESET}`);
});
```

Abaixo estão os arquivos iniciais para cada pasta. Construí um CRUD básico de leitura de usuários para exemplificar o fluxo.

#### `src/config/database.ts`

Este arquivo centraliza a conexão com o banco de dados SQLite. Ele cria o arquivo `database.sqlite` na raiz se não existir e já cria uma tabela de exemplo.

```typescript
import sqlite3 from "sqlite3";
import path from "path";
import { consoleColors } from "../utils/consoleColors";

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const { BOLD_RED, BOLD_GREEN, RED, RESET } = consoleColors;

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      `${BOLD_RED}Erro ao conectar ao banco de dados SQLite:${RESET} ${RED}${err.message}${RESET}`,
    );
  } else {
    console.log(`\n${BOLD_GREEN}Conectado ao banco de dados SQLite.${RESET}\n`);

    // +------------------------------------------+
    // | CRIAÇÃO DAS TABELAS, SE NÃO EXISTIREM... |
    // +------------------------------------------+

    // COLORS
    db.run(`
        CREATE TABLE IF NOT EXISTS colors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          hexColor TEXT NOT NULL UNIQUE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // +-------------------------------------------+
    // | CRIAÇÃO DAS TRIGGERS, SE NÃO EXISTIREM... |
    // +-------------------------------------------+

    // COLORS
    db.run(`
          CREATE TRIGGER IF NOT EXISTS update_colors_updatedAt
          AFTER UPDATE ON colors
          BEGIN
              UPDATE colors 
              SET updatedAt = CURRENT_TIMESTAMP 
              WHERE id = OLD.id;
          END;
        `);
  }
});

export default db;
```

#### `src/models/ColorModel.ts`

O Model é o único lugar que interage com o banco de dados. Como o `sqlite3` trabalha com callbacks, encapsulamos as operações em `Promises` para que o Controller possa usar `async/await` de forma limpa.

```typescript
import type { Database } from "sqlite3";
import { AllColorsProps, ColorProps } from "../types";

export class ColorModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +-------------------+
  // | Cria uma nova COR |
  // +-------------------+
  public createColor({ name, hexColor }: ColorProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO colors (name, hexColor) VALUES (?, ?)",
        [name, hexColor],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        },
      );
    });
  }

  // +----------------------+
  // | Busca todas as CORES |
  // +----------------------+
  public async getAllColors(
    perPage: number,
    rowsToSkip: number,
  ): Promise<AllColorsProps> {
    const getColors = new Promise<ColorProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM colors LIMIT ? OFFSET ?;",
        [perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as ColorProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM colors;",
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [colors, totalCount] = await Promise.all([getColors, getTotal]);

      return {
        data: colors,
        meta: {
          currentPage: Math.floor(rowsToSkip / perPage) + 1,
          perPage: perPage,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / perPage),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // +-------------------+
  // | Busca COR pelo ID |
  // +-------------------+
  public getColorById(id: number | string): Promise<ColorProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM colors WHERE id = ?",
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve((row as ColorProps) || null);
          }
        },
      );
    });
  }

  // +----------------------+
  // | Atualiza COR pelo ID |
  // +----------------------+
  public updateColorById({ id, name, hexColor }: ColorProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE colors SET name = ?, hexColor = ? WHERE id = ?",
        [name, hexColor, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        },
      );
    });
  }

  // +--------------------+
  // | Deleta COR pelo ID |
  // +--------------------+
  public deleteColorById(id: number | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM colors WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
```

#### `src/models/index.ts`

```typescript
import db from "../config/database";
import { ColorModel as ColorModelClass } from "./ColorModel";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);
```

#### `src/controllers/ColorController.ts`

O Controller recebe a requisição, chama o Model para processar os dados e devolve a resposta HTTP adequada. Nenhuma query SQL deve existir aqui.

```typescript
import type { Request, Response } from "express";
import { ColorModel } from "../models";

export class ColorController {
  // +-------------------+
  // | Cria uma nova COR |
  // +-------------------+
  public static async create(req: Request, res: Response): Promise<void> {
    const { name, hexColor } = req.body;

    if (!name || !hexColor) {
      res
        .status(400)
        .json({ error: "Nome e código hexadecimal da COR são obrigatórios." });
      return;
    }

    try {
      const newColorId = await ColorModel.createColor({ name, hexColor });

      res.status(201).json({ id: newColorId, name, hexColor });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar a COR. Verifique se ela já está cadastrada.",
      });
    }
  }

  // +----------------------+
  // | Busca todas as CORES |
  // +----------------------+
  public static async getAll(req: Request, res: Response): Promise<void> {
    let { perPage, page } = req.query;

    let limit = Number(perPage);
    if (!limit || Number.isNaN(limit) || limit < 1 || limit > 20) {
      limit = 20;
    }

    let currentPage = Number(page);
    if (!currentPage || Number.isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

    const rowsToSkip = (currentPage - 1) * limit;

    try {
      const colors = await ColorModel.getAllColors(limit, rowsToSkip);

      if (!colors) {
        res.status(404).json({ error: "CORES não encontradas." });
        return;
      }

      res.status(200).json(colors);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar CORES no banco de dados." });
    }
  }

  // +-------------------+
  // | Busca COR pelo ID |
  // +-------------------+
  public static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID é obrigatório." });
        return;
      }

      const color = await ColorModel.getColorById(id);

      if (!color) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      res.status(200).json(color);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar COR no banco de dados." });
    }
  }

  // +----------------------+
  // | Atualiza COR pelo ID |
  // +----------------------+
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, hexColor } = req.body;

      if (!id || typeof id !== "string" || !name || !hexColor) {
        res.status(400).json({
          error: "ID, nome e código hexadecimal da COR são obrigatórios.",
        });
        return;
      }

      const color = await ColorModel.updateColorById({ id, name, hexColor });

      if (!color) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      res.status(200).json({ message: "COR atualizada com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar COR no banco de dados." });
    }
  }

  // +--------------------+
  // | Deleta COR pelo ID |
  // +--------------------+
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID é obrigatório." });
        return;
      }

      const isColorDeleted = await ColorModel.deleteColorById(id);

      if (!isColorDeleted) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      res.status(200).json({ message: "COR deletada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar COR no banco de dados." });
    }
  }
}
```

### `src/controllers/index.ts`

```typescript
export { ColorController } from "./ColorController";
```

#### `src/routes/userRoutes.ts`

As rotas ligam as URLs (endpoints) aos métodos do Controller.

```typescript
import { Router } from "express";
import { ColorController } from "../controllers";
import { validatehexColor } from "../middleware/validateHexColor";

const router = Router();
// +-------------------+
// | Cria uma nova COR |
// +-------------------+
router.post("/colors", validatehexColor, ColorController.create);

// +----------------------+
// | Busca todas as CORES |
// +----------------------+
router.get("/colors", ColorController.getAll);

// +-------------------+
// | Busca COR pelo ID |
// +-------------------+
router.get("/colors/:id", ColorController.getOne);

// +----------------------+
// | Atualiza COR pelo ID |
// +----------------------+
router.patch("/colors/:id", validatehexColor, ColorController.update);

// +--------------------+
// | Deleta COR pelo ID |
// +--------------------+
router.delete("/colors/:id", ColorController.delete);

export default router;
```

### `src/controllers/index.ts`

```typescript
export { default as userRoutes } from "./ColorRoute";
```

### `src/middleware/validateHexColor.ts`

```typescript
import { Request, Response, NextFunction } from "express";

export function validatehexColor(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { hexColor } = req.body;

  if (!hexColor) {
    res.status(400).json({ error: "O campo hexColor é obrigatório." });
    return;
  }

  // Regex explicada:
  // ^#                                 -> Começa obrigatoriamente com '#'
  // ([A-Fa-f0-9]{3} | [A-Fa-f0-9]{6})  -> Seguido por exatamente 3 ou exatamente 6 caracteres hexadecimais (letras de A a F, maiúsculas ou minúsculas, e números de 0 a 9)
  // $                                  -> Termina ali, sem caracteres extras
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

  if (!hexRegex.test(hexColor)) {
    res.status(400).json({
      error:
        "Formato de cor inválido. Deve começar com '#' e conter 3 ou 6 caracteres hexadecimais (0-9, a-f).",
    });
    return;
  }

  next();
}
```

### `src/types/index.ts`

```typescript
// +----------------+
// | CONSOLE COLORS |
// +----------------+
export type ConsoleColorsProps = {
  RESET: string;
  BOLD: string;
  UNDERLINE: string;
  BLACK: string;
  RED: string;
  GREEN: string;
  YELLOW: string;
  BLUE: string;
  MAGENTA: string;
  CYAN: string;
  WHITE: string;
  BOLD_BLACK: string;
  BOLD_RED: string;
  BOLD_GREEN: string;
  BOLD_YELLOW: string;
  BOLD_BLUE: string;
  BOLD_MAGENTA: string;
  BOLD_CYAN: string;
  BOLD_WHITE: string;
  BG_BLACK: string;
  BG_RED: string;
  BG_GREEN: string;
  BG_YELLOW: string;
  BG_BLUE: string;
  BG_MAGENTA: string;
  BG_CYAN: string;
  BG_WHITE: string;
};

// +-------+
// | COLOR |
// +-------+
export type ColorProps = {
  id?: string | number;
  name: string;
  hexColor: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllColorsProps = {
  data: ColorProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};
```

### `src/utils/consoleColors.ts`

```typescript
import { ConsoleColorsProps } from "../types";

export const consoleColors: ConsoleColorsProps = {
  // Especiais
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  UNDERLINE: "\x1b[4m",

  // Cores de Texto Padrão
  BLACK: "\x1b[30m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",

  // Cores de Texto em Negrito (Bold)
  BOLD_BLACK: "\x1b[1;30m",
  BOLD_RED: "\x1b[1;31m",
  BOLD_GREEN: "\x1b[1;32m",
  BOLD_YELLOW: "\x1b[1;33m",
  BOLD_BLUE: "\x1b[1;34m",
  BOLD_MAGENTA: "\x1b[1;35m",
  BOLD_CYAN: "\x1b[1;36m",
  BOLD_WHITE: "\x1b[1;37m",

  // Cores de Fundo (Background)
  BG_BLACK: "\x1b[40m",
  BG_RED: "\x1b[41m",
  BG_GREEN: "\x1b[42m",
  BG_YELLOW: "\x1b[43m",
  BG_BLUE: "\x1b[44m",
  BG_MAGENTA: "\x1b[45m",
  BG_CYAN: "\x1b[46m",
  BG_WHITE: "\x1b[47m",
};
```

---

### 4. Configurar os Scripts de Execução

Para rodar o projeto de forma eficiente com o `tsx` (que executa TypeScript diretamente sem precisar compilar para JS a cada alteração), abra o seu `package.json` e adicione os seguintes scripts:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}

```

### Como testar:

1. No terminal, inicie o servidor:

```bash
npm run dev

```

2. Abra seu navegador ou ferramenta de API (como Insomnia/Postman) e faça um **GET** em `http://localhost:3000/api/colors`. Deve retornar uma array vazia `[]`.
3. Faça um **POST** na mesma URL enviando um JSON no body para testar a inserção direta no SQLite:

```json
{
  "hexColor": "#fff333"
}
```
