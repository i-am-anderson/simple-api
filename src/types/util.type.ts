import { ColorProps } from "./";

// +------------------+
// | CORES DO CONSOLE |
// +------------------+
export type ConsoleColorsProps = {
  RESET: string;
  BOLD: string;
  UNDERLINE: string;
  BLACK: string;
  RED: string;
  GREEN: string;
  YELLOW: string;
  BLUE: string;
  MAGENTA: string;
  CYAN: string;
  WHITE: string;
  BOLD_BLACK: string;
  BOLD_RED: string;
  BOLD_GREEN: string;
  BOLD_YELLOW: string;
  BOLD_BLUE: string;
  BOLD_MAGENTA: string;
  BOLD_CYAN: string;
  BOLD_WHITE: string;
  BG_BLACK: string;
  BG_RED: string;
  BG_GREEN: string;
  BG_YELLOW: string;
  BG_BLUE: string;
  BG_MAGENTA: string;
  BG_CYAN: string;
  BG_WHITE: string;
};

// +-----------+
// | GENÉRICOS |
// +-----------+
export type QueryProps = {
  perPage?: string;
  page?: string;
  name?: string;
};

export type LocalsProps = {
  limit: number;
  rowsToSkip: number;
  name: string;
};

export type FilterProps = {
  name?: string;
};

// para SETUPS e ESTRATÉGIAS 
export type TradingSystemProps = {
  id?: number;
  name: string;
  description: string;
  idColor: number;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type TradingSystemWithColorProps = Omit<TradingSystemProps, "idColor"> & {
  color: ColorProps;
};

export type TradingSystemQueryResult = {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  colorId: number;
  colorName: string;
  colorHex: string;
};

export type AllTradingSystemsProps = {
  data: TradingSystemWithColorProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};