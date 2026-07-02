import type { Request, Response } from "express";
import { SetupModel, ColorModel } from "../models";
import { TradingSystemProps, LocalsProps } from "../types";

export class SetupController {
  // +--------------------+
  // | Cria um novo SETUP |
  // +--------------------+
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

      const newSetupId = await SetupModel.createSetup({
        name,
        idColor,
        description,
      });

      res.status(201).json({ id: newSetupId, name, idColor, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar o SETUP. Verifique se ele já está cadastrado.",
      });
    }
  }

  // +-----------------------+
  // | Busca todos os SETUPS |
  // +-----------------------+
  public static async getAll(
    _: Request,
    res: Response<{}, LocalsProps>,
  ): Promise<void> {
    const { limit, rowsToSkip, name } = res.locals;

    try {
      const setups = await SetupModel.getAllSetups(limit, rowsToSkip, {
        name,
      });

      if (!setups) {
        res.status(404).json({ error: "SETUPS não encontrados." });
        return;
      }

      res.status(200).json(setups);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar SETUPS no banco de dados." });
    }
  }

  // +---------------------+
  // | Busca SETUP pelo ID |
  // +---------------------+
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const setup = await SetupModel.getSetupById(Number(id));

      if (!setup) {
        res.status(404).json({ error: "SETUP não encontrado." });
        return;
      }

      res.status(200).json(setup);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar SETUP no banco de dados." });
    }
  }

  // +------------------------+
  // | Atualiza SETUP pelo ID |
  // +------------------------+
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

      const setup = await SetupModel.updateSetupById({
        id: Number(id),
        name,
        idColor,
        description,
      });

      if (!setup) {
        res.status(404).json({ error: "SETUP não encontrado." });
        return;
      }

      res.status(200).json({ message: "SETUP atualizado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar SETUP no banco de dados." });
    }
  }

  // +----------------------+
  // | Deleta SETUP pelo ID |
  // +----------------------+
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isSetupDeleted = await SetupModel.deleteSetupById(Number(id));

      if (!isSetupDeleted) {
        res.status(404).json({ error: "SETUP não encontrado." });
        return;
      }

      res.status(200).json({ message: "SETUP deletado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar SETUP no banco de dados." });
    }
  }
}
