// +--------+
// | CONTAS |
// +--------+
export type AccountProps = {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllAccountsProps = {
  data: AccountProps[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};
