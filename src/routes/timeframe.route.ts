import { Router } from "express";
import { TimeframeController } from "../controllers";
import { validateBody, validateQuery, validateParams } from "../middlewares";

const router = Router();
// +------------------------+
// | Cria um novo TIMEFRAME |
// +------------------------+
router.post("/timeframes", validateBody, TimeframeController.create);

// +---------------------------+
// | Busca todos os TIMEFRAMES |
// +---------------------------+
router.get("/timeframes", validateQuery, TimeframeController.getAll);

// +-------------------------+
// | Busca TIMEFRAME pelo ID |
// +-------------------------+
router.get("/timeframes/:id", validateParams, TimeframeController.getOne);

// +----------------------------+
// | Atualiza TIMEFRAME pelo ID |
// +----------------------------+
router.patch(
  "/timeframes/:id",
  validateParams,
  validateBody,
  TimeframeController.update,
);

// +--------------------------+
// | Deleta TIMEFRAME pelo ID |
// +--------------------------+
router.delete("/timeframes/:id", validateParams, TimeframeController.delete);

export default router;
