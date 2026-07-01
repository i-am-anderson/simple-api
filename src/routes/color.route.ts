import { Router } from "express";
import { ColorController } from "../controllers";
import {
  validateBodyColor,
  validateParamsColor,
  validateQueryColor,
} from "../middlewares";

const router = Router();
// +-------------------+
// | Cria uma nova COR |
// +-------------------+
router.post("/colors", validateBodyColor, ColorController.create);

// +----------------------+
// | Busca todas as CORES |
// +----------------------+
router.get("/colors", validateQueryColor, ColorController.getAll);

// +-------------------+
// | Busca COR pelo ID |
// +-------------------+
router.get("/colors/:id", validateParamsColor, ColorController.getOne);

// +----------------------+
// | Atualiza COR pelo ID |
// +----------------------+
router.patch(
  "/colors/:id",
  validateParamsColor,
  validateBodyColor,
  ColorController.update,
);

// +--------------------+
// | Deleta COR pelo ID |
// +--------------------+
router.delete("/colors/:id", validateParamsColor, ColorController.delete);

export default router;
