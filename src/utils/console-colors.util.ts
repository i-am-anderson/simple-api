import { ConsoleColorsProps } from "../types";

export const consoleColors: ConsoleColorsProps = {
  // Especiais
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  UNDERLINE: "\x1b[4m",

  // Cores de Texto Padrão
  BLACK: "\x1b[30m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",

  // Cores de Texto em Negrito (Bold)
  BOLD_BLACK: "\x1b[1;30m",
  BOLD_RED: "\x1b[1;31m",
  BOLD_GREEN: "\x1b[1;32m",
  BOLD_YELLOW: "\x1b[1;33m",
  BOLD_BLUE: "\x1b[1;34m",
  BOLD_MAGENTA: "\x1b[1;35m",
  BOLD_CYAN: "\x1b[1;36m",
  BOLD_WHITE: "\x1b[1;37m",

  // Cores de Fundo (Background)
  BG_BLACK: "\x1b[40m",
  BG_RED: "\x1b[41m",
  BG_GREEN: "\x1b[42m",
  BG_YELLOW: "\x1b[43m",
  BG_BLUE: "\x1b[44m",
  BG_MAGENTA: "\x1b[45m",
  BG_CYAN: "\x1b[46m",
  BG_WHITE: "\x1b[47m",
};
