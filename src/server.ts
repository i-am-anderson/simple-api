import express from "express";
import cors from "cors";
import { global } from "./configs";
import { consoleColors } from "./helpers";
import {
  ColorRoute,
  AccountRoute,
  TimeframeRoute,
  MarketRoute,
  SymbolRoute,
  SetupRoute,
  StrategyRoute,
} from "./routes";

const app = express();
const PORT = global.port;
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
app.use("/api/v1", TimeframeRoute);
app.use("/api/v1", MarketRoute);
app.use("/api/v1", SymbolRoute);
app.use("/api/v1", SetupRoute);
app.use("/api/v1", StrategyRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor iniciado em ${BOLD_CYAN}${UNDERLINE}http://localhost:${PORT}${RESET}`,
  );
});
