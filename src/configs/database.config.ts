import sqlite3 from "sqlite3";
import path from "path";
import { consoleColors } from "../helpers";

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

    // CONTAS
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // TIMEFRAMES
    db.run(`
        CREATE TABLE IF NOT EXISTS timeframes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // MERCADOS
    db.run(`
        CREATE TABLE IF NOT EXISTS markets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

    // SÍMBOLOS
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

    // ESTRATÉGIAS
    db.run(`
        CREATE TABLE IF NOT EXISTS strategies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          idColor INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idColor) REFERENCES colors(id) ON DELETE SET NULL
        );
      `);

    // PRINCÍPIOS
    db.run(`
        CREATE TABLE IF NOT EXISTS principles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idStrategy INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idStrategy) REFERENCES strategies(id) ON DELETE CASCADE
        );
      `);

    // SETUPS
    db.run(`
        CREATE TABLE IF NOT EXISTS setups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          idColor INTEGER,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idColor) REFERENCES colors(id) ON DELETE SET NULL
        );
      `);

    // REGRAS
    db.run(`
        CREATE TABLE IF NOT EXISTS rules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idSetup INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idSetup) REFERENCES setups(id) ON DELETE CASCADE
        );
      `);

    // +-------------------------------------------+
    // | CRIAÇÃO DAS TRIGGERS, SE NÃO EXISTIREM... |
    // +-------------------------------------------+
  }
});

export default db;
