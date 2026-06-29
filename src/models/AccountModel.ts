import type { Database } from "sqlite3";
import { AllAccountsProps, AccountProps } from "../types";

export class AccountModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +-----------------------+
  // | Cria uma nova ACCOUNT |
  // +-----------------------+
  public createAccount({ name, description }: AccountProps): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO accounts (name, description) VALUES (?, ?)",
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
  // | Busca todas as ACCOUNTS |
  // +-------------------------+
  public async getAllAccounts(
    per_page: number,
    rows_to_skip: number,
  ): Promise<AllAccountsProps> {
    const getAccounts = new Promise<AccountProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM accounts LIMIT ? OFFSET ?;",
        [per_page, rows_to_skip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as AccountProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM accounts;",
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [accounts, totalCount] = await Promise.all([getAccounts, getTotal]);

      return {
        data: accounts,
        meta: {
          current_page: Math.floor(rows_to_skip / per_page) + 1,
          per_page: per_page,
          total_items: totalCount,
          total_pages: Math.ceil(totalCount / per_page),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // +-----------------------+
  // | Busca ACCOUNT pelo ID |
  // +-----------------------+
  public getAccountById(id: number | string): Promise<AccountProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM accounts WHERE id = ?",
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve((row as AccountProps) || null);
          }
        },
      );
    });
  }

  // +--------------------------+
  // | Atualiza ACCOUNT pelo ID |
  // +--------------------------+
  public updateAccountById({
    id,
    name,
    description,
  }: AccountProps): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE accounts SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
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
  // | Deleta ACCOUNT pelo ID |
  // +------------------------+
  public deleteAccountById(id: number | string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM accounts WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
