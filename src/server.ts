import express from "express";
import cors from "cors";
import { global } from "./configs";
import { consoleColors } from "./utils";
import { ColorRoute } from "./routes";

const app = express();
const PORT = global.port
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor iniciado em ${BOLD_CYAN}${UNDERLINE}http://localhost:${PORT}${RESET}`,
  );
});
