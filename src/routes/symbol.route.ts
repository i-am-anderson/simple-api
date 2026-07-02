import { Router } from "express";
import { SymbolController } from "../controllers";
import {
  validateBodySymbol,
  validateParams,
  validateQuerySymbol,
} from "../middlewares";

const router = Router();
// +----------------------+
// | Cria um novo SÍMBOLO |
// +----------------------+
router.post("/symbols", validateBodySymbol, SymbolController.create);

// +-------------------------+
// | Busca todos os SÍMBOLOS |
// +-------------------------+
router.get("/symbols", validateQuerySymbol, SymbolController.getAll);

// +-----------------------+
// | Busca SÍMBOLO pelo ID |
// +-----------------------+
router.get("/symbols/:id", validateParams, SymbolController.getOne);

// +--------------------------+
// | Atualiza SÍMBOLO pelo ID |
// +--------------------------+
router.patch(
  "/symbols/:id",
  validateParams,
  validateBodySymbol,
  SymbolController.update,
);

// +------------------------+
// | Deleta SÍMBOLO pelo ID |
// +------------------------+
router.delete("/symbols/:id", validateParams, SymbolController.delete);

export default router;
