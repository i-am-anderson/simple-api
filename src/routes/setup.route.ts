import { Router } from "express";
import { SetupController } from "../controllers";
import {
  validateBodyTradingSystem,
  validateParams,
  validateQuery,
} from "../middlewares";

const router = Router();
// +--------------------+
// | Cria um novo SETUP |
// +--------------------+
router.post("/setups", validateBodyTradingSystem, SetupController.create);

// +-----------------------+
// | Busca todos os SETUPS |
// +-----------------------+
router.get("/setups", validateQuery, SetupController.getAll);

// +-------------------+
// | Busca SETUP pelo ID |
// +-------------------+
router.get("/setups/:id", validateParams, SetupController.getOne);

// +------------------------+
// | Atualiza SETUP pelo ID |
// +------------------------+
router.patch(
  "/setups/:id",
  validateParams,
  validateBodyTradingSystem,
  SetupController.update,
);

// +----------------------+
// | Deleta SETUP pelo ID |
// +----------------------+
router.delete("/setups/:id", validateParams, SetupController.delete);

export default router;
