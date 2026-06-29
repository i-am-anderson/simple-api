import { Router } from "express";
import { AccountController } from "../controllers";

const router = Router();
// +---------------------+
// | Cria uma nova CONTA |
// +---------------------+
router.post("/accounts", AccountController.create);

// +-----------------------+
// | Busca todas as CONTAS |
// +-----------------------+
router.get("/accounts", AccountController.getAll);

// +---------------------+
// | Busca CONTA pelo ID |
// +---------------------+
router.get("/accounts/:id", AccountController.getOne);

// +------------------------+
// | Atualiza CONTA pelo ID |
// +------------------------+
router.patch("/accounts/:id", AccountController.update);

// +----------------------+
// | Deleta CONTA pelo ID |
// +----------------------+
router.delete("/accounts/:id", AccountController.delete);

export default router;
