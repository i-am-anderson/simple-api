import type { Database } from "sqlite3";
import {
  AllTradingSystemsProps,
  TradingSystemProps,
  FilterProps,
  TradingSystemQueryResult,
  TradingSystemWithColorProps,
} from "../types";

export class SetupModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +--------------------+
  // | Cria um novo SETUP |
  // +--------------------+
  public createSetup({
    name,
    idColor,
    description,
  }: TradingSystemProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO setups (name, idColor, description) VALUES (?, ?, ?)",
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

  // +-----------------------+
  // | Busca todos os SETUPS |
  // +-----------------------+
  public async getAllSetups(
    perPage: number,
    rowsToSkip: number,
    filters: FilterProps,
  ): Promise<AllTradingSystemsProps> {
    const name = filters.name ? `%${filters.name}%` : null;

    const getSetups = new Promise<TradingSystemQueryResult[]>(
      (resolve, reject) => {
        this.db.all(
          `SELECT 
            s.id, s.name, s.description, s.createdAt, s.updatedAt,
            c.id AS colorId, c.name AS colorName, c.hexColor AS colorHex 
        FROM setups AS s 
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
        "SELECT COUNT(*) AS total FROM setups WHERE (name LIKE ? OR ? IS NULL);",
        [name, name],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row ? row.total : 0);
        },
      );
    });

    try {
      const [setups, totalCount] = await Promise.all([getSetups, getTotal]);

      const data: TradingSystemWithColorProps[] = setups.map((setup) => ({
        id: setup.id,
        name: setup.name,
        description: setup.description,
        color: {
          id: setup.colorId,
          name: setup.colorName,
          hexColor: setup.colorHex,
        },
        createdAt: new Date(`${setup.createdAt}Z`).toISOString(),
        updatedAt: new Date(`${setup.updatedAt}Z`).toISOString(),
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

  // +---------------------+
  // | Busca SETUP pelo ID |
  // +---------------------+
  public async getSetupById(
    id: number,
  ): Promise<TradingSystemWithColorProps | null> {
    const getSetup = new Promise<TradingSystemQueryResult | null>(
      (resolve, reject) => {
        this.db.get(
          `SELECT 
            s.id, s.name, s.description, s.createdAt, s.updatedAt,
            c.id AS colorId, c.name AS colorName, c.hexColor AS colorHex 
          FROM setups AS s 
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
      const row = await getSetup;

      if (!row) {
        return null;
      }

      const setups: TradingSystemWithColorProps = {
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

      return setups;
    } catch (error) {
      throw error;
    }
  }

  // +------------------------+
  // | Atualiza SETUP pelo ID |
  // +------------------------+
  public updateSetupById({
    id,
    name,
    idColor,
    description,
  }: TradingSystemProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE setups SET name = ?, idColor = ?, description = ?,  updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
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

  // +----------------------+
  // | Deleta SETUP pelo ID |
  // +----------------------+
  public deleteSetupById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM setups WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
