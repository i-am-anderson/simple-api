import { QueryProps, LocalsProps, FilterProps } from "./";

// +-------+
// | CORES |
// +-------+
export type QueryColorProps = QueryProps & {
  hexColor?: string;
};

export type LocalsColorProps = LocalsProps & {
  hexColor: string;
};

export type FilterColorProps = FilterProps & {
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
