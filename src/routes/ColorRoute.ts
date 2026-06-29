import { Router } from "express";
import { ColorController } from "../controllers";
import { validatehexColor } from "../middleware/validateHexColor";

const router = Router();
// +-------------------+
// | Cria uma nova COR |
// +-------------------+
router.post("/colors", validatehexColor, ColorController.create);

// +----------------------+
// | Busca todas as CORES |
// +----------------------+
router.get("/colors", ColorController.getAll);

// +-------------------+
// | Busca COR pelo ID |
// +-------------------+
router.get("/colors/:id", ColorController.getOne);

// +----------------------+
// | Atualiza COR pelo ID |
// +----------------------+
router.patch("/colors/:id", validatehexColor, ColorController.update);

// +--------------------+
// | Deleta COR pelo ID |
// +--------------------+
router.delete("/colors/:id", ColorController.delete);

export default router;
