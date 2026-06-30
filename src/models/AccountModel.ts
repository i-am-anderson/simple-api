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
    perPage: number,
    rowsToSkip: number,
  ): Promise<AllAccountsProps> {
    const getAccounts = new Promise<AccountProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM accounts LIMIT ? OFFSET ?;",
        [perPage, rowsToSkip],
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
  // | Busca ACCOUNT pelo ID |
  // +-----------------------+
  public getAccountById(id: number): Promise<AccountProps | null> {
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
  public deleteAccountById(id: number): Promise<boolean> {
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
