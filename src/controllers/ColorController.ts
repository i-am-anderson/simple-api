import type { Request, Response } from "express";
import { ColorModel } from "../models";

export class ColorController {
  // +-------------------+
  // | Cria uma nova COR |
  // +-------------------+
  public static async create(req: Request, res: Response): Promise<void> {
    const { name, hexColor } = req.body;

    if (!name || !hexColor) {
      res
        .status(400)
        .json({ error: "Nome e código hexadecimal da COR são obrigatórios." });
      return;
    }

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
      const colors = await ColorModel.getAllColors(limit, rowsToSkip);

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
  public static async getOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      res.status(400).json({ error: "ID é obrigatório." });
      return;
    }

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
  public static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, hexColor } = req.body;

    if (!id || Number.isNaN(Number(id)) || !name || !hexColor) {
      res.status(400).json({
        error: "ID, nome e código hexadecimal da COR são obrigatórios.",
      });
      return;
    }

    try {
      const color = await ColorModel.updateColorById({ id: Number(id), name, hexColor });

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
  public static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      res.status(400).json({ error: "ID é obrigatório." });
      return;
    }

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
