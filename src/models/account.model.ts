import type { Database } from "sqlite3";
import { AllAccountsProps, AccountProps, FilterProps } from "../types";

export class AccountModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // +---------------------+
  // | Cria uma nova CONTA |
  // +---------------------+
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

  // +-----------------------+
  // | Busca todas as CONTAS |
  // +-----------------------+
  public async getAllAccounts(
    perPage: number,
    rowsToSkip: number,
    filters: FilterProps,
  ): Promise<AllAccountsProps> {
    const name = filters.name ? `%${filters.name}%` : null;

    const getAccounts = new Promise<AccountProps[]>((resolve, reject) => {
      this.db.all(
        "SELECT * FROM accounts WHERE (name LIKE ? OR ? IS NULL) LIMIT ? OFFSET ?;",
        [name, name, perPage, rowsToSkip],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows as AccountProps[]);
        },
      );
    });

    const getTotal = new Promise<number>((resolve, reject) => {
      this.db.get(
        "SELECT COUNT(*) AS total FROM accounts WHERE (name LIKE ? OR ? IS NULL);",
        [name, name],
        function (err, row: { total: number }) {
          if (err) reject(err);
          else resolve(row.total);
        },
      );
    });

    try {
      const [accounts, totalCount] = await Promise.all([getAccounts, getTotal]);

      const data = accounts.map((account) => ({
        ...account,
        createdAt: new Date(`${account.createdAt}Z`).toISOString(),
        updatedAt: new Date(`${account.updatedAt}Z`).toISOString(),
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

  // +---------------------+
  // | Busca CONTA pelo ID |
  // +---------------------+
  public getAccountById(id: number): Promise<AccountProps | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM accounts WHERE id = ?",
        [id],
        function (err, row: AccountProps) {
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

  // +------------------------+
  // | Atualiza CONTA pelo ID |
  // +------------------------+
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

  // +----------------------+
  // | Deleta CONTA pelo ID |
  // +----------------------+
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
