import { Router } from "express";
import { SymbolController } from "../controllers";

const router = Router();
// +----------------------+
// | Cria um novo SÍMBOLO |
// +----------------------+
router.post("/symbols", SymbolController.create);

// +-------------------------+
// | Busca todos os SÍMBOLOS |
// +-------------------------+
router.get("/symbols", SymbolController.getAll);

// +-----------------------+
// | Busca SÍMBOLO pelo ID |
// +-----------------------+
router.get("/symbols/:id", SymbolController.getOne);

// +--------------------------+
// | Atualiza SÍMBOLO pelo ID |
// +--------------------------+
router.patch("/symbols/:id", SymbolController.update);

// +------------------------+
// | Deleta SÍMBOLO pelo ID |
// +------------------------+
router.delete("/symbols/:id", SymbolController.delete);

export default router;
