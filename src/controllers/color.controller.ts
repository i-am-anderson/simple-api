import type { Request, Response } from "express";
import { ColorModel } from "../models";
import { ColorProps, LocalsColorProps } from "../types";

export class ColorController {
  // +-------------------+
  // | Cria uma nova COR |
  // +-------------------+
  public static async create(
    req: Request<{}, {}, ColorProps>,
    res: Response,
  ): Promise<void> {
    const { name, hexColor } = req.body;

    try {
      const newColorId = await ColorModel.createColor({ name, hexColor });

      res.status(201).json({ id: newColorId, name, hexColor });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar a COR. Verifique se ela já está cadastrada.",
      });
    }
  }

  // +----------------------+
  // | Busca todas as CORES |
  // +----------------------+
  public static async getAll(
    _: Request,
    res: Response<
      {},
      LocalsColorProps
    >,
  ): Promise<void> {
    const { limit, rowsToSkip, name, hexColor } = res.locals;

    try {
      const colors = await ColorModel.getAllColors(limit, rowsToSkip, {
        name,
        hexColor,
      });

      if (!colors) {
        res.status(404).json({ error: "CORES não encontradas." });
        return;
      }

      res.status(200).json(colors);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar CORES no banco de dados." });
    }
  }

  // +-------------------+
  // | Busca COR pelo ID |
  // +-------------------+
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const color = await ColorModel.getColorById(Number(id));

      if (!color) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      res.status(200).json(color);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar COR no banco de dados." });
    }
  }

  // +----------------------+
  // | Atualiza COR pelo ID |
  // +----------------------+
  public static async update(
    req: Request<{ id: string }, {}, ColorProps>,
    res: Response,
  ): Promise<void> {
    const { name, hexColor } = req.body;
    const { id } = req.params;

    try {
      const color = await ColorModel.updateColorById({
        id: Number(id),
        name,
        hexColor,
      });

      if (!color) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      res.status(200).json({ message: "COR atualizada com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar COR no banco de dados." });
    }
  }

  // +--------------------+
  // | Deleta COR pelo ID |
  // +--------------------+
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isColorDeleted = await ColorModel.deleteColorById(Number(id));

      if (!isColorDeleted) {
        res.status(404).json({ error: "COR não encontrada." });
        return;
      }

      res.status(200).json({ message: "COR deletada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar COR no banco de dados." });
    }
  }
}
