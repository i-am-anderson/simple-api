import { Request, Response, NextFunction } from "express";
import { ColorProps, QueryColorProps } from "../types";

export function validateBodyColor(
  req: Request<{}, {}, ColorProps>,
  res: Response,
  next: NextFunction,
): void {
  const { name, hexColor } = req.body;

  if (!name) {
    res.status(400).json({ error: "O campo name é obrigatório." });
    return;
  }

  if (!hexColor) {
    res.status(400).json({ error: "O campo hexColor é obrigatório." });
    return;
  }

  // Regex explicada:
  // ^#                                 -> Começa obrigatoriamente com '#'
  // ([A-Fa-f0-9]{3} | [A-Fa-f0-9]{6})  -> Seguido por exatamente 3 ou exatamente 6 caracteres hexadecimais (letras de A a F, maiúsculas ou minúsculas, e números de 0 a 9)
  // $                                  -> Termina ali, sem caracteres extras
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

  if (!hexRegex.test(hexColor)) {
    res.status(400).json({
      error:
        "Formato de cor inválido. Deve começar com '#' e conter 3 ou 6 caracteres hexadecimais (0-9, a-f).",
    });
    return;
  }

  next();
}

export function validateParamsColor(
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

export function validateQueryColor(
  req: Request<
    {},
    {},
    {},
    QueryColorProps
  >,
  res: Response,
  next: NextFunction,
): void {
  const { perPage, page, name, hexColor } = req.query;

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
  const hexColor_ = hexColor ? String(hexColor).trim() : "";

  res.locals.limit = limit;
  res.locals.rowsToSkip = rowsToSkip;
  res.locals.name = name_;
  res.locals.hexColor = hexColor_;

  next();
}
