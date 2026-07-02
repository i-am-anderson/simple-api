import { db } from "../configs";
import { ColorModel as ColorModelClass } from "./color.model";
import { AccountModel as AccountModelClass } from "./account.model";
import { TimeframeModel as TimeframeModelClass } from "./timeframe.model";
import { MarketModel as MarketModelClass } from "./market.model";
import { SymbolModel as SymbolModelClass } from "./symbol.model";
import { SetupModel as SetupModelClass } from "./setup.model";
import { StrategyModel as StrategyModelClass } from "./strategy.model";

// Injeção de Dependência
export const ColorModel = new ColorModelClass(db);
export const AccountModel = new AccountModelClass(db);
export const TimeframeModel = new TimeframeModelClass(db);
export const MarketModel = new MarketModelClass(db);
export const SymbolModel = new SymbolModelClass(db);
export const SetupModel = new SetupModelClass(db);
export const StrategyModel = new StrategyModelClass(db);
