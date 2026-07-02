import { Router } from "express";
import { MarketController } from "../controllers";
import { validateBody, validateQuery, validateParams } from "../middlewares";

const router = Router();
// +----------------------+
// | Cria um novo MERCADO |
// +----------------------+
router.post("/markets", validateBody, MarketController.create);

// +-------------------------+
// | Busca todos os MERCADOS |
// +-------------------------+
router.get("/markets", validateQuery, MarketController.getAll);

// +-----------------------+
// | Busca MERCADO pelo ID |
// +-----------------------+
router.get("/markets/:id", validateParams, MarketController.getOne);

// +--------------------------+
// | Atualiza MERCADO pelo ID |
// +--------------------------+
router.patch(
  "/markets/:id",
  validateParams,
  validateBody,
  MarketController.update,
);

// +------------------------+
// | Deleta MERCADO pelo ID |
// +------------------------+
router.delete("/markets/:id", validateParams, MarketController.delete);

export default router;
