// +----------------+
// | CONSOLE COLORS |
// +----------------+
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

// +-------+
// | COLOR |
// +-------+
export type ColorProps = {
  id?: string | number;
  name: string;
  hexColor: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AllColorsProps = {
  data: ColorProps[];
  meta: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};
