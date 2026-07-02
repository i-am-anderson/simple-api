import type { Database } from "sqlite3";
import {
  AllTradingSystemsProps,
  TradingSystemProps,
  FilterProps,
  TradingSystemQueryResult,
  TradingSystemWithColorProps,
} from "../types";

export class StrategyModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +-------------------------+
  // | Cria um novo ESTRATÉGIA |
  // +-------------------------+
  public createStrategy({
    name,
    idColor,
    description,
  }: TradingSystemProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO strategies (name, idColor, description) VALUES (?, ?, ?)",
        [name, idColor, description],
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

  // +----------------------------+
  // | Busca todos os ESTRATÉGIAS |
  // +----------------------------+
  public async getAllStrategys(
    perPage: number,
    rowsToSkip: number,
    filters: FilterProps,
  ): Promise<AllTradingSystemsProps> {
    const name = filters.name ? `%${filters.name}%` : null;

    const getStrategys = new Promise<TradingSystemQueryResult[]>(
      (resolve, reject) => {
        this.db.all(
          `SELECT 
            s.id, s.name, s.description, s.createdAt, s.updatedAt,
            c.id AS colorId, c.name AS colorName, c.hexColor AS colorHex 
        FROM strategies AS s 
        INNER JOIN colors AS c ON s.idColor = c.id 
        WHERE (s.name LIKE ? OR ? IS NULL)
        LIMIT ? OFFSET ?;`,
          [name, name, perPage, rowsToSkip],
          function (err, rows) {
            if (err) reject(err);
            else resolve(rows as TradingSystemQueryResult[]);
          },
        );
      },
    );

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM strategies WHERE (name LIKE ? OR ? IS NULL);",
        [name, name],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row ? row.total : 0);
        },
      );
    });

    try {
      const [strategies, totalCount] = await Promise.all([
        getStrategys,
        getTotal,
      ]);

      const data: TradingSystemWithColorProps[] = strategies.map(
        (strategy) => ({
          id: strategy.id,
          name: strategy.name,
          description: strategy.description,
          color: {
            id: strategy.colorId,
            name: strategy.colorName,
            hexColor: strategy.colorHex,
          },
          createdAt: new Date(`${strategy.createdAt}Z`).toISOString(),
          updatedAt: new Date(`${strategy.updatedAt}Z`).toISOString(),
        }),
      );

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

  // +--------------------------+
  // | Busca ESTRATÉGIA pelo ID |
  // +--------------------------+
  public async getStrategyById(
    id: number,
  ): Promise<TradingSystemWithColorProps | null> {
    const getStrategy = new Promise<TradingSystemQueryResult | null>(
      (resolve, reject) => {
        this.db.get(
          `SELECT 
            s.id, s.name, s.description, s.createdAt, s.updatedAt,
            c.id AS colorId, c.name AS colorName, c.hexColor AS colorHex 
          FROM strategies AS s 
          INNER JOIN colors AS c ON s.idColor = c.id 
          WHERE s.id = ?;`,
          [id],
          function (err, row: TradingSystemQueryResult) {
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
      const row = await getStrategy;

      if (!row) {
        return null;
      }

      const strategies: TradingSystemWithColorProps = {
        id: row.id,
        name: row.name,
        description: row.description,
        color: {
          id: row.colorId,
          name: row.colorName,
          hexColor: row.colorHex,
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };

      return strategies;
    } catch (error) {
      throw error;
    }
  }

  // +-----------------------------+
  // | Atualiza ESTRATÉGIA pelo ID |
  // +-----------------------------+
  public updateStrategyById({
    id,
    name,
    idColor,
    description,
  }: TradingSystemProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE strategies SET name = ?, idColor = ?, description = ?,  updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [name, idColor, description, id],
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

  // +---------------------------+
  // | Deleta ESTRATÉGIA pelo ID |
  // +---------------------------+
  public deleteStrategyById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM strategies WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
