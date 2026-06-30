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
    // Habilita o suporte a chaves estrangeiras no SQLite
    db.run("PRAGMA foreign_keys = ON;");

    console.log(
      `\n${BOLD_GREEN}Conectado ao banco de dados SQLite...${RESET}\n`,
    );

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

    // ACCOUNTS
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // TIMEFRAMES
    db.run(`
        CREATE TABLE IF NOT EXISTS timeframes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // MARKETS
    db.run(`
        CREATE TABLE IF NOT EXISTS markets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // SYMBOLS
    db.run(`
        CREATE TABLE IF NOT EXISTS symbols (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ticker TEXT NOT NULL UNIQUE,
            idMarket INTEGER NOT NULL,
            description TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idMarket) REFERENCES markets(id) ON DELETE RESTRICT
        );
      `);

    // +-------------------------------------------+
    // | CRIAÇÃO DAS TRIGGERS, SE NÃO EXISTIREM... |
    // +-------------------------------------------+
  }
});

export default db;
