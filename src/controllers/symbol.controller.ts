import type { Request, Response } from "express";
import { SymbolModel, MarketModel } from "../models";
import { SymbolProps, LocalsSymbolProps } from "../types";

export class SymbolController {
  // +----------------------+
  // | Cria um novo SÍMBOLO |
  // +----------------------+
  public static async create(
    req: Request<{}, {}, SymbolProps>,
    res: Response,
  ): Promise<void> {
    const { name, ticker, idMarket, description = "" } = req.body;

    try {
      const market = await MarketModel.getMarketById(idMarket);

      if (!market) {
        res.status(404).json({ error: "MERCADO não encontrado." });
        return;
      }

      const newSymbolId = await SymbolModel.createSymbol({
        name,
        ticker,
        idMarket,
        description,
      });

      res
        .status(201)
        .json({ id: newSymbolId, name, ticker, idMarket, description });
    } catch (error) {
      res.status(500).json({
        error:
          "Não foi possível criar o SÍMBOLO. Verifique se ele já está cadastrado.",
      });
    }
  }

  // +-------------------------+
  // | Busca todos os SÍMBOLOS |
  // +-------------------------+
  public static async getAll(
    _: Request,
    res: Response<{}, LocalsSymbolProps>,
  ): Promise<void> {
    const { limit, rowsToSkip, name, ticker } = res.locals;

    try {
      const symbols = await SymbolModel.getAllSymbols(limit, rowsToSkip, {
        name,
        ticker,
      });

      if (!symbols) {
        res.status(404).json({ error: "SÍMBOLOS não encontrados." });
        return;
      }

      res.status(200).json(symbols);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar SÍMBOLOS no banco de dados." });
    }
  }

  // +-----------------------+
  // | Busca SÍMBOLO pelo ID |
  // +-----------------------+
  public static async getOne(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const symbol = await SymbolModel.getSymbolById(Number(id));

      if (!symbol) {
        res.status(404).json({ error: "SÍMBOLO não encontrado." });
        return;
      }

      res.status(200).json(symbol);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar SÍMBOLO no banco de dados." });
    }
  }

  // +--------------------------+
  // | Atualiza SÍMBOLO pelo ID |
  // +--------------------------+
  public static async update(
    req: Request<{ id: string }, {}, SymbolProps>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;
    const { name, ticker, idMarket, description = "" } = req.body;

    try {
      const market = await MarketModel.getMarketById(idMarket);

      if (!market) {
        res.status(404).json({ error: "MERCADO não encontrado." });
        return;
      }

      const symbol = await SymbolModel.updateSymbolById({
        id: Number(id),
        name,
        ticker,
        idMarket,
        description,
      });

      if (!symbol) {
        res.status(404).json({ error: "SÍMBOLO não encontrado." });
        return;
      }

      res.status(200).json({ message: "SÍMBOLO atualizado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar SÍMBOLO no banco de dados." });
    }
  }

  // +------------------------+
  // | Deleta SÍMBOLO pelo ID |
  // +------------------------+
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.params;

    try {
      const isSymbolDeleted = await SymbolModel.deleteSymbolById(Number(id));

      if (!isSymbolDeleted) {
        res.status(404).json({ error: "SÍMBOLO não encontrado." });
        return;
      }

      res.status(200).json({ message: "SÍMBOLO deletado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar SÍMBOLO no banco de dados." });
    }
  }
}
