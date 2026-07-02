import type { Database } from "sqlite3";
import { AllMarketsProps, MarketProps, FilterProps } from "../types";

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
    filters: FilterProps,
  ): Promise<AllMarketsProps> {
    const name = filters.name ? `%${filters.name}%` : null;

    const getMarkets = new Promise<MarketProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM markets WHERE (name LIKE ? OR ? IS NULL) LIMIT ? OFFSET ?;",
        [name, name, perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as MarketProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM markets WHERE (name LIKE ? OR ? IS NULL);",
        [name, name],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [markets, totalCount] = await Promise.all([getMarkets, getTotal]);

      const data = markets.map((market) => ({
        ...market,
        createdAt: new Date(`${market.createdAt}Z`).toISOString(),
        updatedAt: new Date(`${market.updatedAt}Z`).toISOString(),
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

  // +-----------------------+
  // | Busca MERCADO pelo ID |
  // +-----------------------+
  public getMarketById(id: number): Promise<MarketProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM markets WHERE id = ?",
        [id],
        function (err, row: MarketProps) {
          if (err) return reject(err);
          if (!row) return resolve(null);

          resolve({
            ...row,
            createdAt: new Date(`${row.createdAt}Z`).toISOString(),
            updatedAt: new Date(`${row.updatedAt}Z`).toISOString(),
          });
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
  public deleteMarketById(id: number): Promise<boolean> {
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
