import { Request, Response, NextFunction } from "express";
import { TradingSystemProps } from "../types";

export function validateBody(
  req: Request<{}, {}, { name: string }>,
  res: Response,
  next: NextFunction,
): void {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "O campo name é obrigatório." });
    return;
  }

  next();
}

export function validateParams(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): void {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    res.status(400).json({
      error: "ID é obrigatório.",
    });
    return;
  }

  next();
}

export function validateQuery(
  req: Request<
    {},
    {},
    {},
    {
      perPage?: string;
      page?: string;
      name?: string;
    }
  >,
  res: Response,
  next: NextFunction,
): void {
  const { perPage, page, name } = req.query;

  let limit = Number(perPage);
  if (!limit || Number.isNaN(limit) || limit < 1 || limit > 20) {
    limit = 20;
  }

  let currentPage = Number(page);
  if (!currentPage || Number.isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }

  const rowsToSkip = (currentPage - 1) * limit;

  const name_ = name ? String(name).trim() : "";

  res.locals.limit = limit;
  res.locals.rowsToSkip = rowsToSkip;
  res.locals.name = name_;

  next();
}

// para SETUPS e ESTRATÉGIAS 
export function validateBodyTradingSystem(
  req: Request<{}, {}, TradingSystemProps>,
  res: Response,
  next: NextFunction,
): void {
  const { name, description, idColor } = req.body;

  if (!name) {
    res.status(400).json({ error: "O campo name é obrigatório." });
    return;
  }

  if (!description) {
    res.status(400).json({ error: "O campo description é obrigatório." });
    return;
  }

  if (!idColor) {
    res.status(400).json({ error: "O campo idColor é obrigatório." });
    return;
  }

  next();
}
