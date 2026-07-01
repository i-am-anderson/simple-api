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
