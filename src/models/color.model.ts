import type { Database } from "sqlite3";
import { AllColorsProps, ColorProps, FilterColorProps } from "../types";

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
    filters: FilterColorProps,
  ): Promise<AllColorsProps> {
    const name = filters.name ? `%${filters.name}%` : null;
    const hexColor = filters.hexColor || null;

    const getColors = new Promise<ColorProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM colors WHERE (name LIKE ? OR ? IS NULL) AND (hexColor = ? OR ? IS NULL) LIMIT ? OFFSET ?;",
        [name, name, hexColor, hexColor, perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as ColorProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM colors WHERE (name LIKE ? OR ? IS NULL) AND (hexColor = ? OR ? IS NULL);",
        [name, name, hexColor, hexColor],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [colors, totalCount] = await Promise.all([getColors, getTotal]);

      const data = colors.map((color) => ({
        ...color,
        createdAt: new Date(`${color.createdAt}Z`).toISOString(),
        updatedAt: new Date(`${color.updatedAt}Z`).toISOString(),
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

  // +-------------------+
  // | Busca COR pelo ID |
  // +-------------------+
  public getColorById(id: number): Promise<ColorProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM colors WHERE id = ?",
        [id],
        function (err, row: ColorProps) {
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
  public deleteColorById(id: number): Promise<boolean> {
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
