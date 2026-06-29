import type { Database } from "sqlite3";
import { AllSymbolsProps, SymbolProps } from "../types";

export class SymbolModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +----------------------+
  // | Cria um novo SÍMBOLO |
  // +----------------------+
  public createSymbol({
    name,
    ticker,
    idMarket,
    description,
  }: SymbolProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO symbols (name, ticker, idMarket, description) VALUES (?, ?, ?, ?)",
        [name, ticker, idMarket, description],
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

  // +-------------------------+
  // | Busca todos os SÍMBOLOS |
  // +-------------------------+
  public async getAllSymbols(
    perPage: number,
    rowsToSkip: number,
  ): Promise<AllSymbolsProps> {
    const getSymbols = new Promise<SymbolProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM symbols LIMIT ? OFFSET ?;",
        [perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as SymbolProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM symbols;",
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [symbols, totalCount] = await Promise.all([getSymbols, getTotal]);

      return {
        data: symbols,
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

  // +-----------------------+
  // | Busca SÍMBOLO pelo ID |
  // +-----------------------+
  public getSymbolById(id: number | string): Promise<SymbolProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM symbols WHERE id = ?",
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve((row as SymbolProps) || null);
          }
        },
      );
    });
  }

  // +--------------------------+
  // | Atualiza SÍMBOLO pelo ID |
  // +--------------------------+
  public updateSymbolById({
    id,
    name,
    ticker,
    idMarket,
    description,
  }: SymbolProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE symbols SET name = ?, ticker = ?, idMarket = ?, description = ?,  updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [name, ticker, idMarket, description, id],
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

  // +------------------------+
  // | Deleta SÍMBOLO pelo ID |
  // +------------------------+
  public deleteSymbolById(id: number | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM symbols WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
