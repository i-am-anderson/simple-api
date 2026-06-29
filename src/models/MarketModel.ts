import type { Database } from "sqlite3";
import { AllMarketsProps, MarketProps } from "../types";

export class MarketModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +----------------------+
  // | Cria um novo MERCADO |
  // +----------------------+
  public createMarket({ name, description }: MarketProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO markets (name, description) VALUES (?, ?)",
        [name, description],
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
  // | Busca todos os MERCADOS |
  // +-------------------------+
  public async getAllMarkets(
    perPage: number,
    rowsToSkip: number,
  ): Promise<AllMarketsProps> {
    const getMarkets = new Promise<MarketProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM markets LIMIT ? OFFSET ?;",
        [perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as MarketProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM markets;",
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [markets, totalCount] = await Promise.all([getMarkets, getTotal]);

      return {
        data: markets,
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
  // | Busca MERCADO pelo ID |
  // +-----------------------+
  public getMarketById(id: number | string): Promise<MarketProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM markets WHERE id = ?",
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve((row as MarketProps) || null);
          }
        },
      );
    });
  }

  // +--------------------------+
  // | Atualiza MERCADO pelo ID |
  // +--------------------------+
  public updateMarketById({
    id,
    name,
    description,
  }: MarketProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE markets SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [name, description, id],
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
  // | Deleta MERCADO pelo ID |
  // +------------------------+
  public deleteMarketById(id: number | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM markets WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
