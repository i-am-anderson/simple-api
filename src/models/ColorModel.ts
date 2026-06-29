import type { Database } from "sqlite3";
import { AllColorsProps, ColorProps } from "../types";

export class ColorModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +-------------------+
  // | Cria uma nova COR |
  // +-------------------+
  public createColor({ name, hexColor }: ColorProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO colors (name, hexColor) VALUES (?, ?)",
        [name, hexColor],
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

  // +----------------------+
  // | Busca todas as CORES |
  // +----------------------+
  public async getAllColors(
    perPage: number,
    rowsToSkip: number,
  ): Promise<AllColorsProps> {
    const getColors = new Promise<ColorProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM colors LIMIT ? OFFSET ?;",
        [perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as ColorProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM colors;",
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [colors, totalCount] = await Promise.all([getColors, getTotal]);

      return {
        data: colors,
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

  // +-------------------+
  // | Busca COR pelo ID |
  // +-------------------+
  public getColorById(id: number | string): Promise<ColorProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM colors WHERE id = ?",
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve((row as ColorProps) || null);
          }
        },
      );
    });
  }

  // +----------------------+
  // | Atualiza COR pelo ID |
  // +----------------------+
  public updateColorById({ id, name, hexColor }: ColorProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE colors SET name = ?, hexColor = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [name, hexColor, id],
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

  // +--------------------+
  // | Deleta COR pelo ID |
  // +--------------------+
  public deleteColorById(id: number | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM colors WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
