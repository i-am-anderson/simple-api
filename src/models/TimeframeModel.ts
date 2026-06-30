import type { Database } from "sqlite3";
import { AllTimeframesProps, TimeframeProps } from "../types";

export class TimeframeModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +------------------------+
  // | Cria um novo TIMEFRAME |
  // +------------------------+
  public createTimeframe({
    name,
    description,
  }: TimeframeProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO timeframes (name, description) VALUES (?, ?)",
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

  // +---------------------------+
  // | Busca todos os TIMEFRAMES |
  // +---------------------------+
  public async getAllTimeframes(
    perPage: number,
    rowsToSkip: number,
  ): Promise<AllTimeframesProps> {
    const getTimeframes = new Promise<TimeframeProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM timeframes LIMIT ? OFFSET ?;",
        [perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as TimeframeProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM timeframes;",
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [timeframes, totalCount] = await Promise.all([
        getTimeframes,
        getTotal,
      ]);

      return {
        data: timeframes,
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

  // +-------------------------+
  // | Busca TIMEFRAME pelo ID |
  // +-------------------------+
  public getTimeframeById(id: number): Promise<TimeframeProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM timeframes WHERE id = ?",
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve((row as TimeframeProps) || null);
          }
        },
      );
    });
  }

  // +----------------------------+
  // | Atualiza TIMEFRAME pelo ID |
  // +----------------------------+
  public updateTimeframeById({
    id,
    name,
    description,
  }: TimeframeProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE timeframes SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
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

  // +--------------------------+
  // | Deleta TIMEFRAME pelo ID |
  // +--------------------------+
  public deleteTimeframeById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM timeframes WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
