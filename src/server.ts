import express from "express";
import cors from "cors";
import { ColorRoute, AccountRoute } from "./routes";
import { consoleColors } from "./utils/consoleColors";

const app = express();
const PORT = process.env.PORT || 3600;
const { BOLD_CYAN, UNDERLINE, RESET } = consoleColors;

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// Rotas
app.use("/api/v1", ColorRoute);
app.use("/api/v1", AccountRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado em ${BOLD_CYAN}${UNDERLINE}http://localhost:${PORT}${RESET}`);
});
