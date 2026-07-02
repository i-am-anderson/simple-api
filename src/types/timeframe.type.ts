// +------------+
// | TIMEFRAMES |
// +------------+
export type TimeframeProps = {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllTimeframesProps = {
  data: TimeframeProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};
