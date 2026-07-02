import { MarketProps, FilterProps, LocalsProps, QueryProps } from "./";

// +----------+
// | SÍMBOLOS |
// +----------+
export type QuerySymbolProps = QueryProps & {
  ticker?: string;
};

export type LocalsSymbolProps = LocalsProps & {
  ticker: string;
};

export type FilterSymbolProps = FilterProps & {
  ticker?: string;
};

export type SymbolProps = {
  id?: number;
  name: string;
  ticker: string;
  idMarket: number;
  description?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type SymbolWithMarketProps = Omit<SymbolProps, "idMarket"> & {
  market: MarketProps;
};

export type SymbolQueryResult = {
  id: number;
  name: string;
  ticker: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  marketId: number;
  marketName: string;
  marketDescription: string;
};

export type AllSymbolsProps = {
  data: SymbolWithMarketProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};
