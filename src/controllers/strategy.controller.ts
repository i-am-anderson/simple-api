import type { Request, Response } from "express";
import { StrategyModel, ColorModel } from "../models";
import { TradingSystemProps, LocalsProps } from "../types";

export class StrategyController {
  // +-------------------------+
  // | Cria um novo ESTRATÉGIA |
  // +-------------------------+
  public static async create(
    req: Request<{}, {}, TradingSystemProps>,
    res: Response,
  ): Promise<void> {
    const { name, description, idColor } = req.body;

    try {
      const color = await ColorModel.getColorById(idColor);

      if (!color) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      const newStrategyId = await StrategyModel.createStrategy({
        name,
        idColor,
        description,
      });

      res.status(201).json({ id: newStrategyId, name, idColor, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar o ESTRATÉGIA. Verifique se ele já está cadastrado.",
      });
    }
  }

  // +----------------------------+
  // | Busca todos os ESTRATÉGIAS |
  // +----------------------------+
  public static async getAll(
    _: Request,
    res: Response<{}, LocalsProps>,
  ): Promise<void> {
    const { limit, rowsToSkip, name } = res.locals;

    try {
      const setups = await StrategyModel.getAllStrategys(limit, rowsToSkip, {
        name,
      });

      if (!setups) {
        res.status(404).json({ error: "ESTRATÉGIAS não encontrados." });
        return;
      }

      res.status(200).json(setups);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar ESTRATÉGIAS no banco de dados." });
    }
  }

  // +--------------------------+
  // | Busca ESTRATÉGIA pelo ID |
  // +--------------------------+
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const setup = await StrategyModel.getStrategyById(Number(id));

      if (!setup) {
        res.status(404).json({ error: "ESTRATÉGIA não encontrado." });
        return;
      }

      res.status(200).json(setup);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar ESTRATÉGIA no banco de dados." });
    }
  }

  // +-----------------------------+
  // | Atualiza ESTRATÉGIA pelo ID |
  // +-----------------------------+
  public static async update(
    req: Request<{ id: string }, {}, TradingSystemProps>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { name, idColor, description } = req.body;

    try {
      const color = await ColorModel.getColorById(idColor);

      if (!color) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      const setup = await StrategyModel.updateStrategyById({
        id: Number(id),
        name,
        idColor,
        description,
      });

      if (!setup) {
        res.status(404).json({ error: "ESTRATÉGIA não encontrado." });
        return;
      }

      res.status(200).json({ message: "ESTRATÉGIA atualizado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar ESTRATÉGIA no banco de dados." });
    }
  }

  // +---------------------------+
  // | Deleta ESTRATÉGIA pelo ID |
  // +---------------------------+
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isStrategyDeleted = await StrategyModel.deleteStrategyById(Number(id));

      if (!isStrategyDeleted) {
        res.status(404).json({ error: "ESTRATÉGIA não encontrado." });
        return;
      }

      res.status(200).json({ message: "ESTRATÉGIA deletado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar ESTRATÉGIA no banco de dados." });
    }
  }
}
