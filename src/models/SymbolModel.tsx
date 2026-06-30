import type { Database } from "sqlite3";
import {
  AllSymbolsProps,
  SymbolProps,
  SymbolQueryResult,
  SymbolWithMarketProps,
} from "../types";

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
    const getSymbols = new Promise<SymbolQueryResult[]>((resolve, reject) => {
      this.db.all(
        `SELECT 
            s.id, s.name, s.ticker, s.description, s.createdAt, s.updatedAt,
            m.id AS marketId, m.name AS marketName, m.description AS marketDescription 
        FROM symbols AS s 
        INNER JOIN markets AS m ON s.idMarket = m.id 
        LIMIT ? OFFSET ?;`,
        [perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as SymbolQueryResult[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM symbols;",
        function (err, row: { total: number } | undefined) {
          if (err) reject(err);
          else resolve(row ? row.total : 0);
        },
      );
    });

    try {
      const [rows, totalCount] = await Promise.all([getSymbols, getTotal]);

      const symbols: SymbolWithMarketProps[] = rows.map((row) => ({
        id: row.id,
        name: row.name,
        ticker: row.ticker,
        description: row.description,
        market: {
          id: row.marketId,
          name: row.marketName,
          description: row.marketDescription,
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      return {
        data: symbols,
        meta: {
          currentPage: Math.floor(rowsToSkip / perPage) + 1,
          perPage: perPage,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / perPage) || 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // +-----------------------+
  // | Busca SÍMBOLO pelo ID |
  // +-----------------------+
  public async getSymbolById(
    id: number,
  ): Promise<SymbolWithMarketProps | null> {
    const getSymbol = new Promise<SymbolQueryResult | undefined>(
      (resolve, reject) => {
        this.db.get(
          `SELECT 
            s.id, s.name, s.ticker, s.description, s.createdAt, s.updatedAt,
            m.id AS marketId, m.name AS marketName, m.description AS marketDescription 
          FROM symbols AS s 
          INNER JOIN markets AS m ON s.idMarket = m.id 
          WHERE s.id = ?;`,
          [id],
          function (err, row) {
            if (err) reject(err);
            else resolve(row as SymbolQueryResult | undefined);
          },
        );
      },
    );

    try {
      const row = await getSymbol;

      if (!row) {
        return null;
      }

      const symbols: SymbolWithMarketProps = {
        id: row.id,
        name: row.name,
        ticker: row.ticker,
        description: row.description,
        market: {
          id: row.marketId,
          name: row.marketName,
          description: row.marketDescription,
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };

      return symbols;
    } catch (error) {
      throw error;
    }
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
  public deleteSymbolById(id: number): Promise<boolean> {
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
