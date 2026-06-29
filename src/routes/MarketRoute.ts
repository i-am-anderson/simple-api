import { Router } from "express";
import { MarketController } from "../controllers";

const router = Router();
// +----------------------+
// | Cria um novo MERCADO |
// +----------------------+
router.post("/markets", MarketController.create);

// +-------------------------+
// | Busca todos os MERCADOS |
// +-------------------------+
router.get("/markets", MarketController.getAll);

// +-----------------------+
// | Busca MERCADO pelo ID |
// +-----------------------+
router.get("/markets/:id", MarketController.getOne);

// +--------------------------+
// | Atualiza MERCADO pelo ID |
// +--------------------------+
router.patch("/markets/:id", MarketController.update);

// +------------------------+
// | Deleta MERCADO pelo ID |
// +------------------------+
router.delete("/markets/:id", MarketController.delete);

export default router;
