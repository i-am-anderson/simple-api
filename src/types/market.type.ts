// +----------+
// | MERCADOS |
// +----------+
export type MarketProps = {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllMarketsProps = {
  data: MarketProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};
