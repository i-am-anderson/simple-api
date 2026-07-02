import { Router } from "express";
import { ColorController } from "../controllers";
import {
  validateBodyColor,
  validateParams,
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
router.get("/colors/:id", validateParams, ColorController.getOne);

// +----------------------+
// | Atualiza COR pelo ID |
// +----------------------+
router.patch(
  "/colors/:id",
  validateParams,
  validateBodyColor,
  ColorController.update,
);

// +--------------------+
// | Deleta COR pelo ID |
// +--------------------+
router.delete("/colors/:id", validateParams, ColorController.delete);

export default router;
