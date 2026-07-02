import type { Request, Response } from "express";
import { MarketModel } from "../models";
import { MarketProps, LocalsProps } from "../types";

export class MarketController {
  // +----------------------+
  // | Cria um novo MERCADO |
  // +----------------------+
  public static async create(
    req: Request<{}, {}, MarketProps>,
    res: Response,
  ): Promise<void> {
    const { name, description = "" } = req.body;

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
  public static async getAll(
    _: Request,
    res: Response<{}, LocalsProps>,
  ): Promise<void> {
    const { limit, rowsToSkip, name } = res.locals;

    try {
      const markets = await MarketModel.getAllMarkets(limit, rowsToSkip, {
        name,
      });

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
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const market = await MarketModel.getMarketById(Number(id));

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
  public static async update(
    req: Request<{ id: string }, {}, MarketProps>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { name, description = "" } = req.body;

    try {
      const market = await MarketModel.updateMarketById({
        id: Number(id),
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
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isMarketDeleted = await MarketModel.deleteMarketById(Number(id));

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
