import { Router } from "express";
import { TimeframeController } from "../controllers";

const router = Router();
// +-------------------------+
// | Cria uma nova TIMEFRAME |
// +-------------------------+
router.post("/timeframes", TimeframeController.create);

// +---------------------------+
// | Busca todas as TIMEFRAMES |
// +---------------------------+
router.get("/timeframes", TimeframeController.getAll);

// +-------------------------+
// | Busca TIMEFRAME pelo ID |
// +-------------------------+
router.get("/timeframes/:id", TimeframeController.getOne);

// +----------------------------+
// | Atualiza TIMEFRAME pelo ID |
// +----------------------------+
router.patch("/timeframes/:id", TimeframeController.update);

// +--------------------------+
// | Deleta TIMEFRAME pelo ID |
// +--------------------------+
router.delete("/timeframes/:id", TimeframeController.delete);

export default router;
