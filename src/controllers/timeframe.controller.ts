import type { Request, Response } from "express";
import { TimeframeModel } from "../models";
import { TimeframeProps, LocalsProps } from "../types";

export class TimeframeController {
  // +------------------------+
  // | Cria um novo TIMEFRAME |
  // +------------------------+
  public static async create(
    req: Request<{}, {}, TimeframeProps>,
    res: Response,
  ): Promise<void> {
    const { name, description = "" } = req.body;

    try {
      const newTimeframeId = await TimeframeModel.createTimeframe({
        name,
        description,
      });

      res.status(201).json({ id: newTimeframeId, name, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar o TIMEFRAME. Verifique se ele já está cadastrado.",
      });
    }
  }

  // +---------------------------+
  // | Busca todos os TIMEFRAMES |
  // +---------------------------+
  public static async getAll(
    _: Request,
    res: Response<{}, LocalsProps>,
  ): Promise<void> {
    const { limit, rowsToSkip, name } = res.locals;

    try {
      const timeframes = await TimeframeModel.getAllTimeframes(
        limit,
        rowsToSkip,
        { name },
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
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const timeframe = await TimeframeModel.getTimeframeById(Number(id));

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
  public static async update(
    req: Request<{ id: string }, {}, TimeframeProps>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { name, description = "" } = req.body;

    try {
      const timeframe = await TimeframeModel.updateTimeframeById({
        id: Number(id),
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
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isTimeframeDeleted = await TimeframeModel.deleteTimeframeById(
        Number(id),
      );

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
