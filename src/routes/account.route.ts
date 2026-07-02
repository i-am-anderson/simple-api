import { Router } from "express";
import { AccountController } from "../controllers";
import { validateBody, validateQuery, validateParams } from "../middlewares";

const router = Router();
// +---------------------+
// | Cria uma nova CONTA |
// +---------------------+
router.post("/accounts", validateBody, AccountController.create);

// +-----------------------+
// | Busca todas as CONTAS |
// +-----------------------+
router.get("/accounts", validateQuery, AccountController.getAll);

// +---------------------+
// | Busca CONTA pelo ID |
// +---------------------+
router.get("/accounts/:id", validateParams, AccountController.getOne);

// +------------------------+
// | Atualiza CONTA pelo ID |
// +------------------------+
router.patch(
  "/accounts/:id",
  validateParams,
  validateBody,
  AccountController.update,
);

// +----------------------+
// | Deleta CONTA pelo ID |
// +----------------------+
router.delete("/accounts/:id", validateParams, AccountController.delete);

export default router;
