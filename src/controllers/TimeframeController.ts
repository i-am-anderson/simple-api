import type { Request, Response } from "express";
import { TimeframeModel } from "../models";

export class TimeframeController {
  // +-------------------------+
  // | Cria uma nova TIMEFRAME |
  // +-------------------------+
  public static async create(req: Request, res: Response): Promise<void> {
    const { name, description = "" } = req.body;

    if (!name) {
      res.status(400).json({
        error: "Nome do TIMEFRAME é obrigatório.",
      });
      return;
    }

    try {
      const newTimeframeId = await TimeframeModel.createTimeframe({
        name,
        description,
      });

      res.status(201).json({ id: newTimeframeId, name, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar a TIMEFRAME. Verifique se ela já está cadastrada.",
      });
    }
  }

  // +---------------------------+
  // | Busca todas as TIMEFRAMES |
  // +---------------------------+
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
      const timeframes = await TimeframeModel.getAllTimeframes(
        limit,
        rows_to_skip,
      );

      if (!timeframes) {
        res.status(404).json({ error: "TIMEFRAMES não encontradas." });
        return;
      }

      res.status(200).json(timeframes);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar TIMEFRAMES no banco de dados." });
    }
  }

  // +-------------------------+
  // | Busca TIMEFRAME pelo ID |
  // +-------------------------+
  public static async getOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID é obrigatório." });
        return;
      }

      const timeframe = await TimeframeModel.getTimeframeById(id);

      if (!timeframe) {
        res.status(404).json({ error: "TIMEFRAME não encontrada." });
        return;
      }

      res.status(200).json(timeframe);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar TIMEFRAME no banco de dados." });
    }
  }

  // +----------------------------+
  // | Atualiza TIMEFRAME pelo ID |
  // +----------------------------+
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description = "" } = req.body;

      if (!id || typeof id !== "string" || !name) {
        res.status(400).json({
          error: "ID e nome do TIMEFRAME são obrigatórios.",
        });
        return;
      }

      const timeframe = await TimeframeModel.updateTimeframeById({
        id,
        name,
        description,
      });

      if (!timeframe) {
        res.status(404).json({ error: "TIMEFRAME não encontrada." });
        return;
      }

      res.status(200).json({ message: "TIMEFRAME atualizado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar TIMEFRAME no banco de dados." });
    }
  }

  // +--------------------------+
  // | Deleta TIMEFRAME pelo ID |
  // +--------------------------+
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID é obrigatório." });
        return;
      }

      const isTimeframeDeleted = await TimeframeModel.deleteTimeframeById(id);

      if (!isTimeframeDeleted) {
        res.status(404).json({ error: "TIMEFRAME não encontrado." });
        return;
      }

      res.status(200).json({ message: "TIMEFRAME deletado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar TIMEFRAME no banco de dados." });
    }
  }
}
