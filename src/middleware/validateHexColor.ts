import { Request, Response, NextFunction } from "express";

export function validatehexColor(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { hexColor } = req.body;

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
