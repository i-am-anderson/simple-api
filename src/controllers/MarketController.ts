import type { Request, Response } from "express";
import { MarketModel } from "../models";

export class MarketController {
  // +----------------------+
  // | Cria um novo MERCADO |
  // +----------------------+
  public static async create(req: Request, res: Response): Promise<void> {
    const { name, description = "" } = req.body;

    if (!name) {
      res.status(400).json({
        error: "Nome do MERCADO é obrigatório.",
      });
      return;
    }

    try {
      const newMarketId = await MarketModel.createMarket({ name, description });

      res.status(201).json({ id: newMarketId, name, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar o MERCADO. Verifique se ele já está cadastrado.",
      });
    }
  }

  // +-------------------------+
  // | Busca todos os MERCADOS |
  // +-------------------------+
  public static async getAll(req: Request, res: Response): Promise<void> {
    let { per_page, page } = req.query;

    let limit = Number(per_page);
    if (!limit || Number.isNaN(limit) || limit < 1 || limit > 20) {
      limit = 20;
    }

    let currentPage = Number(page);
    if (!currentPage || Number.isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

    const rows_to_skip = (currentPage - 1) * limit;

    try {
      const markets = await MarketModel.getAllMarkets(limit, rows_to_skip);

      if (!markets) {
        res.status(404).json({ error: "MERCADOS não encontrados." });
        return;
      }

      res.status(200).json(markets);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar MERCADOS no banco de dados." });
    }
  }

  // +-----------------------+
  // | Busca MERCADO pelo ID |
  // +-----------------------+
  public static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID é obrigatório." });
        return;
      }

      const market = await MarketModel.getMarketById(id);

      if (!market) {
        res.status(404).json({ error: "MERCADO não encontrado." });
        return;
      }

      res.status(200).json(market);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar MERCADO no banco de dados." });
    }
  }

  // +--------------------------+
  // | Atualiza MERCADO pelo ID |
  // +--------------------------+
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description = "" } = req.body;

      if (!id || typeof id !== "string" || !name) {
        res.status(400).json({
          error: "ID e nome do MERCADO são obrigatórios.",
        });
        return;
      }

      const market = await MarketModel.updateMarketById({
        id,
        name,
        description,
      });

      if (!market) {
        res.status(404).json({ error: "MERCADO não encontrado." });
        return;
      }

      res.status(200).json({ message: "MERCADO atualizado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar MERCADO no banco de dados." });
    }
  }

  // +------------------------+
  // | Deleta MERCADO pelo ID |
  // +------------------------+
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID é obrigatório." });
        return;
      }

      const isMarketDeleted = await MarketModel.deleteMarketById(id);

      if (!isMarketDeleted) {
        res.status(404).json({ error: "MERCADO não encontrado." });
        return;
      }

      res.status(200).json({ message: "MERCADO deletado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar MERCADO no banco de dados." });
    }
  }
}
