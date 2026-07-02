import { Router } from "express";
import { StrategyController } from "../controllers";
import {
  validateBodyTradingSystem,
  validateParams,
  validateQuery,
} from "../middlewares";

const router = Router();
// +--------------------------+
// | Cria uma nova ESTRATÉGIA |
// +--------------------------+
router.post(
  "/strategies",
  validateBodyTradingSystem,
  StrategyController.create,
);

// +----------------------------+
// | Busca todas as ESTRATÉGIAS |
// +----------------------------+
router.get("/strategies", validateQuery, StrategyController.getAll);

// +--------------------------+
// | Busca ESTRATÉGIA pelo ID |
// +--------------------------+
router.get("/strategies/:id", validateParams, StrategyController.getOne);

// +-----------------------------+
// | Atualiza ESTRATÉGIA pelo ID |
// +-----------------------------+
router.patch(
  "/strategies/:id",
  validateParams,
  validateBodyTradingSystem,
  StrategyController.update,
);

// +---------------------------+
// | Deleta ESTRATÉGIA pelo ID |
// +---------------------------+
router.delete("/strategies/:id", validateParams, StrategyController.delete);

export default router;
