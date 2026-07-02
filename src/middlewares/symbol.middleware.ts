import { Request, Response, NextFunction } from "express";
import { SymbolProps, QuerySymbolProps } from "../types";

export function validateBodySymbol(
  req: Request<{}, {}, SymbolProps>,
  res: Response,
  next: NextFunction,
): void {
  const { name, ticker, idMarket } = req.body;

  if (!name) {
    res.status(400).json({ error: "O campo name é obrigatório." });
    return;
  }

  if (!ticker) {
    res.status(400).json({ error: "O campo ticker é obrigatório." });
    return;
  }

  if (!idMarket) {
    res.status(400).json({ error: "O campo idMarket é obrigatório." });
    return;
  }

  next();
}

export function validateQuerySymbol(
  req: Request<{}, {}, {}, QuerySymbolProps>,
  res: Response,
  next: NextFunction,
): void {
  const { perPage, page, name, ticker } = req.query;

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
  const ticker_ = ticker ? String(ticker).trim() : "";

  res.locals.limit = limit;
  res.locals.rowsToSkip = rowsToSkip;
  res.locals.name = name_;
  res.locals.ticker = ticker_;

  next();
}
