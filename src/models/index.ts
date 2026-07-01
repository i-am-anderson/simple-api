import { db } from "../configs";
import { ColorModel as ColorModelClass } from "./color.model";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);
