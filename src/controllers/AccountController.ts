import type { Request, Response } from "express";
import { AccountModel } from "../models";

export class AccountController {
  // +---------------------+
  // | Cria uma nova CONTA |
  // +---------------------+
  public static async create(req: Request, res: Response): Promise<void> {
    const { name, description = "" } = req.body;

    if (!name) {
      res
        .status(400)
        .json({
          error: "Nome da CONTA é obrigatório.",
        });
      return;
    }

    try {
      const newAccountId = await AccountModel.createAccount({ name, description });

      res.status(201).json({ id: newAccountId, name, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar a CONTA. Verifique se ela já está cadastrada.",
      });
    }
  }

  // +-----------------------+
  // | Busca todas as CONTAS |
  // +-----------------------+
  public static async getAll(req: Request, res: Response): Promise<void> {
    let { perPage, page } = req.query;

    let limit = Number(perPage);
    if (!limit || Number.isNaN(limit) || limit < 1 || limit > 20) {
      limit = 20;
    }

    let currentPage = Number(page);
    if (!currentPage || Number.isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

    const rowsToSkip = (currentPage - 1) * limit;

    try {
      const accounts = await AccountModel.getAllAccounts(limit, rowsToSkip);

      if (!accounts) {
        res.status(404).json({ error: "CONTAS não encontradas." });
        return;
      }

      res.status(200).json(accounts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar CONTAS no banco de dados." });
    }
  }

  // +---------------------+
  // | Busca CONTA pelo ID |
  // +---------------------+
  public static async getOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      res.status(400).json({ error: "ID é obrigatório." });
      return;
    }

    try {
      const account = await AccountModel.getAccountById(Number(id));

      if (!account) {
        res.status(404).json({ error: "CONTA não encontrada." });
        return;
      }

      res.status(200).json(account);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar CONTA no banco de dados." });
    }
  }

  // +------------------------+
  // | Atualiza CONTA pelo ID |
  // +------------------------+
  public static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, description = "" } = req.body;

    if (!id || Number.isNaN(Number(id)) || !name) {
      res.status(400).json({
        error: "ID e nome da CONTA são obrigatórios.",
      });
      return;
    }

    try {
      const account = await AccountModel.updateAccountById({ id: Number(id), name, description });

      if (!account) {
        res.status(404).json({ error: "CONTA não encontrada." });
        return;
      }

      res.status(200).json({ message: "CONTA atualizada com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar CONTA no banco de dados." });
    }
  }

  // +----------------------+
  // | Deleta CONTA pelo ID |
  // +---------------------+
  public static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      res.status(400).json({ error: "ID é obrigatório." });
      return;
    }

    try {
      const isAccountDeleted = await AccountModel.deleteAccountById(Number(id));

      if (!isAccountDeleted) {
        res.status(404).json({ error: "CONTA não encontrada." });
        return;
      }

      res.status(200).json({ message: "CONTA deletada com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar CONTA no banco de dados." });
    }
  }
}
