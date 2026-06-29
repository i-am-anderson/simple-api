import db from "../config/database";
import { ColorModel as ColorModelClass } from "./ColorModel";
import { AccountModel as AccountModelClass } from "./AccountModel";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);

// Injeção de Dependência
export const AccountModel = new AccountModelClass(db);
