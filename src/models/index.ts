import db from "../config/database";
import { ColorModel as ColorModelClass } from "./ColorModel";
import { AccountModel as AccountModelClass } from "./AccountModel";
import { TimeframeModel as TimeframeModelClass } from "./TimeframeModel";
import { MarketModel as MarketModelClass } from "./MarketModel";
import { SymbolModel as SymbolModelClass } from "./SymbolModel";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);

// Injeção de Dependência
export const AccountModel = new AccountModelClass(db);

// Injeção de Dependência
export const TimeframeModel = new TimeframeModelClass(db);

// Injeção de Dependência
export const MarketModel = new MarketModelClass(db);

// Injeção de Dependência
export const SymbolModel = new SymbolModelClass(db);
