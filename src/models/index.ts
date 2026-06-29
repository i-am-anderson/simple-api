import db from "../config/database";
import { ColorModel as ColorModelClass } from "./ColorModel";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);
