import type { Database } from "sqlite3";
import {
  AllSymbolsProps,
  SymbolProps,
  FilterSymbolProps,
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
    filters: FilterSymbolProps,
  ): Promise<AllSymbolsProps> {
    const name = filters.name ? `%${filters.name}%` : null;
    const ticker = filters.ticker ? `%${filters.ticker}%` : null;

    const getSymbols = new Promise<SymbolQueryResult[]>((resolve, reject) => {
      this.db.all(
        `SELECT 
            s.id, s.name, s.ticker, s.description, s.createdAt, s.updatedAt,
            m.id AS marketId, m.name AS marketName, m.description AS marketDescription 
        FROM symbols AS s 
        INNER JOIN markets AS m ON s.idMarket = m.id 
        WHERE (s.name LIKE ? OR ? IS NULL)
          AND (s.ticker LIKE ? OR ? IS NULL)
        LIMIT ? OFFSET ?;`,
        [name, name, ticker, ticker, perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as SymbolQueryResult[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM symbols WHERE (name LIKE ? OR ? IS NULL) AND (ticker LIKE ? OR ? IS NULL);",
        [name, name, ticker, ticker],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row ? row.total : 0);
        },
      );
    });

    try {
      const [symbols, totalCount] = await Promise.all([getSymbols, getTotal]);

      const data: SymbolWithMarketProps[] = symbols.map((symbol) => ({
        id: symbol.id,
        name: symbol.name,
        ticker: symbol.ticker,
        description: symbol.description,
        market: {
          id: symbol.marketId,
          name: symbol.marketName,
          description: symbol.marketDescription,
        },
        createdAt: new Date(`${symbol.createdAt}Z`).toISOString(),
        updatedAt: new Date(`${symbol.updatedAt}Z`).toISOString(),
      }));

      return {
        data,
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
    const getSymbol = new Promise<SymbolQueryResult | null>(
      (resolve, reject) => {
        this.db.get(
          `SELECT 
            s.id, s.name, s.ticker, s.description, s.createdAt, s.updatedAt,
            m.id AS marketId, m.name AS marketName, m.description AS marketDescription 
          FROM symbols AS s 
          INNER JOIN markets AS m ON s.idMarket = m.id 
          WHERE s.id = ?;`,
          [id],
          function (err, row: SymbolQueryResult) {
            if (err) return reject(err);
            if (!row) return resolve(null);

            resolve({
              ...row,
              createdAt: new Date(`${row.createdAt}Z`).toISOString(),
              updatedAt: new Date(`${row.updatedAt}Z`).toISOString(),
            });
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
