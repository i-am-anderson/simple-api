## MVC + Barrel Pattern + Nomenclatura por Sufixo Técnico

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
 ┣ 📂mocks
 ┃ ┗ 📜color.mock.json
 ┣ 📂src
 ┃ ┣ 📂config
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜global.config.ts
 ┃ ┃ ┗ 📜database.config.ts
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜color.controller.ts
 ┃ ┣ 📂middleware
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜color.middleware.ts
 ┃ ┣ 📂models
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜color.model.ts
 ┃ ┣ 📂routes
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜color.route.ts
 ┃ ┣ 📂types
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┣ 📜color.type.ts
 ┃ ┃ ┗ 📜util.type.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜console-colors.util.ts
 ┃ ┗ 📜server.ts
 ┣ 📜.env
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
                  color.middleware.ts         color.model.ts
                          ↑                         ↑
server.ts → ROUTES → MIDDLEWARES → CONTROLLERS → MODELS → database.ts
              ↓                         ↓
        color.route.ts          color.controller.ts
```

---

### 3. Arquivos de Exemplo

### `colors/color.mock.json`

```json
[
  {
    "name": "Preto",
    "hexColor": "#000000"
  },
  {
    "name": "Branco",
    "hexColor": "#FFFFFF"
  },
  {
    "name": "Vermelho",
    "hexColor": "#FF0000"
  },
  {
    "name": "Verde",
    "hexColor": "#008000"
  },
  {
    "name": "Azul",
    "hexColor": "#0000FF"
  },
  {
    "name": "Amarelo",
    "hexColor": "#FFFF00"
  },
  {
    "name": "Laranja",
    "hexColor": "#FFA500"
  },
  {
    "name": "Roxo",
    "hexColor": "#800080"
  },
  {
    "name": "Rosa",
    "hexColor": "#FFC0CB"
  },
  {
    "name": "Marrom",
    "hexColor": "#8B4513"
  },
  {
    "name": "Cinza",
    "hexColor": "#808080"
  },
  {
    "name": "Cinza Claro",
    "hexColor": "#D3D3D3"
  },
  {
    "name": "Cinza Escuro",
    "hexColor": "#A9A9A9"
  },
  {
    "name": "Ciano",
    "hexColor": "#00FFFF"
  },
  {
    "name": "Turquesa",
    "hexColor": "#40E0D0"
  },
  {
    "name": "Azul Claro",
    "hexColor": "#ADD8E6"
  },
  {
    "name": "Azul Marinho",
    "hexColor": "#000080"
  },
  {
    "name": "Azul Royal",
    "hexColor": "#4169E1"
  },
  {
    "name": "Verde Claro",
    "hexColor": "#90EE90"
  },
  {
    "name": "Verde Limão",
    "hexColor": "#32CD32"
  },
  {
    "name": "Verde Escuro",
    "hexColor": "#006400"
  },
  {
    "name": "Oliva",
    "hexColor": "#808000"
  },
  {
    "name": "Bege",
    "hexColor": "#F5F5DC"
  },
  {
    "name": "Creme",
    "hexColor": "#FFFDD0"
  },
  {
    "name": "Dourado",
    "hexColor": "#FFD700"
  },
  {
    "name": "Prata",
    "hexColor": "#C0C0C0"
  },
  {
    "name": "Coral",
    "hexColor": "#FF7F50"
  },
  {
    "name": "Salmão",
    "hexColor": "#FA8072"
  },
  {
    "name": "Vinho",
    "hexColor": "#722F37"
  },
  {
    "name": "Bordô",
    "hexColor": "#800020"
  },
  {
    "name": "Lilás",
    "hexColor": "#C8A2C8"
  },
  {
    "name": "Lavanda",
    "hexColor": "#E6E6FA"
  },
  {
    "name": "Índigo",
    "hexColor": "#4B0082"
  },
  {
    "name": "Magenta",
    "hexColor": "#FF00FF"
  },
  {
    "name": "Caramelo",
    "hexColor": "#C68E17"
  },
  {
    "name": "Chocolate",
    "hexColor": "#7B3F00"
  },
  {
    "name": "Caqui",
    "hexColor": "#C3B091"
  },
  {
    "name": "Areia",
    "hexColor": "#C2B280"
  },
  {
    "name": "Pêssego",
    "hexColor": "#FFDAB9"
  },
  {
    "name": "Ameixa",
    "hexColor": "#8E4585"
  }
]
```

#### `.env`

```env
PORT=3600
```

#### `server.ts`

```typescript
import express from "express";
import cors from "cors";
import { global } from "./configs";
import { consoleColors } from "./utils";
import { ColorRoute } from "./routes";

const app = express();
const PORT = global.port;
const { BOLD_CYAN, UNDERLINE, RESET } = consoleColors;

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
app.use("/api/v1", ColorRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor iniciado em ${BOLD_CYAN}${UNDERLINE}http://localhost:${PORT}${RESET}`,
  );
});
```

#### `src/configs/database.config.ts`

```typescript
import sqlite3 from "sqlite3";
import path from "path";
import { consoleColors } from "../utils";

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const { BOLD_RED, BOLD_GREEN, RED, RESET } = consoleColors;

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      `${BOLD_RED}Erro ao conectar ao banco de dados SQLite:${RESET} ${RED}${err.message}${RESET}`,
    );
  } else {
    db.run("PRAGMA foreign_keys = ON;");

    console.log(
      `\n${BOLD_GREEN}Conectado ao banco de dados SQLite...${RESET}\n`,
    );

    // +------------------------------------------+
    // | CRIAÇÃO DAS TABELAS, SE NÃO EXISTIREM... |
    // +------------------------------------------+

    // CORES
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
  }
});

export default db;
```

#### `src/configs/global.config.ts`

```typescript
const global = {
  get port() {
    return process.env.PORT || 3000;
  },
};

export default global;
```

#### `src/configs/index.ts`

```typescript
export { default as db } from "./database.config";
```

#### `src/models/color.model.ts`

```typescript
import type { Database } from "sqlite3";
import { AllColorsProps, ColorProps, FilterColorProps } from "../types";

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
    filters: FilterColorProps,
  ): Promise<AllColorsProps> {
    const name = filters.name ? `%${filters.name}%` : null;
    const hexColor = filters.hexColor || null;

    const getColors = new Promise<ColorProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM colors WHERE (name LIKE ? OR ? IS NULL) AND (hexColor = ? OR ? IS NULL) LIMIT ? OFFSET ?;",
        [name, name, hexColor, hexColor, perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as ColorProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM colors WHERE (name LIKE ? OR ? IS NULL) AND (hexColor = ? OR ? IS NULL);",
        [name, name, hexColor, hexColor],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [colors, totalCount] = await Promise.all([getColors, getTotal]);

      const data = colors.map((color) => ({
        ...color,
        createdAt: new Date(`${color.createdAt}Z`).toISOString(),
        updatedAt: new Date(`${color.updatedAt}Z`).toISOString(),
      }));

      return {
        data,
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
  public getColorById(id: number): Promise<ColorProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM colors WHERE id = ?",
        [id],
        function (err, row: ColorProps) {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...row,
              createdAt: new Date(`${row.createdAt}Z`).toISOString(),
              updatedAt: new Date(`${row.updatedAt}Z`).toISOString(),
            });
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
        "UPDATE colors SET name = ?, hexColor = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
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
  public deleteColorById(id: number): Promise<boolean> {
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
import { db } from "../configs";
import { ColorModel as ColorModelClass } from "./color.model";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);
```

#### `src/controllers/color.controller.ts`

```typescript
import type { Request, Response } from "express";
import { ColorModel } from "../models";
import { ColorProps, LocalsColorProps } from "../types";

export class ColorController {
  // +-------------------+
  // | Cria uma nova COR |
  // +-------------------+
  public static async create(
    req: Request<{}, {}, ColorProps>,
    res: Response,
  ): Promise<void> {
    const { name, hexColor } = req.body;

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
  public static async getAll(
    _: Request,
    res: Response<
      {},
      LocalsColorProps
    >,
  ): Promise<void> {
    const { limit, rowsToSkip, name, hexColor } = res.locals;

    try {
      const colors = await ColorModel.getAllColors(limit, rowsToSkip, {
        name,
        hexColor,
      });

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
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const color = await ColorModel.getColorById(Number(id));

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
  public static async update(
    req: Request<{ id: string }, {}, ColorProps>,
    res: Response,
  ): Promise<void> {
    const { name, hexColor } = req.body;
    const { id } = req.params;

    try {
      const color = await ColorModel.updateColorById({
        id: Number(id),
        name,
        hexColor,
      });

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
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isColorDeleted = await ColorModel.deleteColorById(Number(id));

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
export { ColorController } from "./color.controller";
```

#### `src/routes/color.route.ts`

```typescript
import { Router } from "express";
import { ColorController } from "../controllers";
import {
  validateBodyColor,
  validateParamsColor,
  validateQueryColor,
} from "../middlewares";

const router = Router();
// +-------------------+
// | Cria uma nova COR |
// +-------------------+
router.post("/colors", validateBodyColor, ColorController.create);

// +----------------------+
// | Busca todas as CORES |
// +----------------------+
router.get("/colors", validateQueryColor, ColorController.getAll);

// +-------------------+
// | Busca COR pelo ID |
// +-------------------+
router.get("/colors/:id", validateParamsColor, ColorController.getOne);

// +----------------------+
// | Atualiza COR pelo ID |
// +----------------------+
router.patch(
  "/colors/:id",
  validateParamsColor,
  validateBodyColor,
  ColorController.update,
);

// +--------------------+
// | Deleta COR pelo ID |
// +--------------------+
router.delete("/colors/:id", validateParamsColor, ColorController.delete);

export default router;
```

#### `src/routes/index.ts`

```typescript
export { default as ColorRoute } from "./color.route";
```

### `src/middleware/color.middleware.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { ColorProps, QueryColorProps } from "../types";

export function validateBodyColor(
  req: Request<{}, {}, ColorProps>,
  res: Response,
  next: NextFunction,
): void {
  const { name, hexColor } = req.body;

  if (!name) {
    res.status(400).json({ error: "O campo name é obrigatório." });
    return;
  }

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

export function validateParamsColor(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): void {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    res.status(400).json({
      error: "ID é obrigatório.",
    });
    return;
  }

  next();
}

export function validateQueryColor(
  req: Request<
    {},
    {},
    {},
    QueryColorProps
  >,
  res: Response,
  next: NextFunction,
): void {
  const { perPage, page, name, hexColor } = req.query;

  let limit = Number(perPage);
  if (!limit || Number.isNaN(limit) || limit < 1 || limit > 20) {
    limit = 20;
  }

  let currentPage = Number(page);
  if (!currentPage || Number.isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }

  const rowsToSkip = (currentPage - 1) * limit;

  const name_ = name ? String(name).trim() : "";
  const hexColor_ = hexColor ? String(hexColor).trim() : "";

  res.locals.limit = limit;
  res.locals.rowsToSkip = rowsToSkip;
  res.locals.name = name_;
  res.locals.hexColor = hexColor_;

  next();
}
```

### `src/middleware/index.ts`

```typescript
export {
  validateBodyColor,
  validateParamsColor,
  validateQueryColor,
} from "./color.middleware";
```

### `src/types/util.type.ts`

```typescript
// +------------------+
// | CORES DO CONSOLE |
// +------------------+
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
```

### `src/types/color.type.ts`

```typescript
// +-------+
// | CORES |
// +-------+
export type QueryColorProps = {
  perPage?: string;
  page?: string;
  name?: string;
  hexColor?: string;
};

export type LocalsColorProps = {
  limit: number;
  rowsToSkip: number;
  name: string;
  hexColor: string;
};

export type FilterColorProps = {
  name?: string;
  hexColor?: string;
};

export type ColorProps = {
  id?: number;
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

### `src/types/index.ts`

```typescript
export type { ConsoleColorsProps } from "./util.type";
export type { ColorProps, AllColorsProps } from "./color.type";
```

### `src/utils/console-colors.util.ts`

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

### `src/utils/index.util.ts`

```typescript
export { consoleColors } from "./console-colors.util";
```

---

### 4. Configurar os Scripts de Execução

Para rodar o projeto de forma eficiente com o `tsx` (que executa TypeScript diretamente sem precisar compilar para JS a cada alteração), abra o seu `package.json` e adicione os seguintes scripts:

```json
"scripts": {
  "dev": "tsx watch --env-file=.env src/server.ts",
  "typecheck": "npx tsc --noEmit --watch",
  "build": "tsc",
  "start": "node --env-file=.env dist/server.js"
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
  "name": "Amarelo",
  "hexColor": "#fff333"
}
```

#### ÚTIL

```bash
npm rebuild sqlite3 --build-from-source 
```