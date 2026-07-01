// +-------+
// | CORES |
// +-------+
export type QueryColorProps = {
  perPage?: string;
  page?: string;
  name?: string;
  hexColor?: string;
};

export type LocalsColorProps = {
  limit: number;
  rowsToSkip: number;
  name: string;
  hexColor: string;
};

export type FilterColorProps = {
  name?: string;
  hexColor?: string;
};

export type ColorProps = {
  id?: number;
  name: string;
  hexColor: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllColorsProps = {
  data: ColorProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};
