-- Ativar o suporte a Chaves Estrangeiras no SQLite (executar sempre ao conectar)
PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. TABELAS DE SUPORTE (CADASTROS BASE)
-- ============================================================================

CREATE TABLE colors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hexColor TEXT NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE timeframes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE markets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE symbols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ticker TEXT NOT NULL UNIQUE,
    idMarket INTEGER NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idMarket) REFERENCES markets(id) ON DELETE RESTRICT
);

-- ============================================================================
-- 2. REGRAS, ESTRATÉGIAS E SETUPS
-- ============================================================================

CREATE TABLE strategies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    idColor INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idColor) REFERENCES colors(id) ON DELETE SET NULL
);

CREATE TABLE principles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idStrategy INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idStrategy) REFERENCES strategies(id) ON DELETE CASCADE
);

CREATE TABLE setups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    idColor INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idColor) REFERENCES colors(id) ON DELETE SET NULL
);

CREATE TABLE rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idSetup INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idSetup) REFERENCES setups(id) ON DELETE CASCADE
);

-- ============================================================================
-- 3. TABELAS DE TAGS
-- ============================================================================

CREATE TABLE error_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. A TABELA CENTRAL (TRADES)
-- ============================================================================

CREATE TABLE trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idAccount INTEGER NOT NULL,
    entryDate TEXT NOT NULL, -- SQLite armazena datas como TEXT (ISO8601), REAL ou INTEGER
    idSymbol INTEGER NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')), 
    idTimeframe INTEGER NOT NULL,
    exitDate TEXT,
    entryPrice REAL NOT NULL,
    exitPrice REAL,
    size REAL NOT NULL,
    stopLoss REAL,
    takeProfit REAL,
    pnl REAL DEFAULT 0.0,
    pnlPct REAL DEFAULT 0.0,
    idStrategy INTEGER,
    idSetup INTEGER,
    status TEXT CHECK (status IN ('WIN', 'LOSS', 'BREAKEVEN')),
    note TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idAccount) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (idSymbol) REFERENCES symbols(id) ON DELETE RESTRICT,
    FOREIGN KEY (idTimeframe) REFERENCES timeframes(id) ON DELETE RESTRICT,
    FOREIGN KEY (idStrategy) REFERENCES strategies(id) ON DELETE SET NULL,
    FOREIGN KEY (idSetup) REFERENCES setups(id) ON DELETE SET NULL,
);

-- ============================================================================
-- 5. TABELAS PIVOT / RELACIONAIS E MÍDIA
-- ============================================================================

CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idTrade INTEGER NOT NULL,
    url TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTrade) REFERENCES trades(id) ON DELETE CASCADE
);

CREATE TABLE timeframes_setups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idTimeframe INTEGER NOT NULL,
    idSetup INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTimeframe) REFERENCES timeframes(id) ON DELETE CASCADE,
    FOREIGN KEY (idSetup) REFERENCES setups(id) ON DELETE CASCADE,
    UNIQUE(idTimeframe, idSetup) -- Evita duplicidade da mesma relação
);

CREATE TABLE markets_setups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idMarket INTEGER NOT NULL,
    idSetup INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idMarket) REFERENCES markets(id) ON DELETE CASCADE,
    FOREIGN KEY (idSetup) REFERENCES setups(id) ON DELETE CASCADE,
    UNIQUE(idMarket, idSetup)
);

CREATE TABLE emotions_trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idEmotion INTEGER NOT NULL,
    idTrade INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idEmotion) REFERENCES emotions(id) ON DELETE CASCADE,
    FOREIGN KEY (idTrade) REFERENCES trades(id) ON DELETE CASCADE,
    UNIQUE(idEmotion, idTrade)
);

CREATE TABLE error_tags_trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idErrorTag INTEGER NOT NULL,
    idTrade INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idErrorTag) REFERENCES error_tags(id) ON DELETE CASCADE,
    FOREIGN KEY (idTrade) REFERENCES trades(id) ON DELETE CASCADE,
    UNIQUE(idErrorTag, idTrade)
);

CREATE TABLE goals_trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idGoal INTEGER NOT NULL,
    idTrade INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idGoal) REFERENCES goals(id) ON DELETE CASCADE,
    FOREIGN KEY (idTrade) REFERENCES trades(id) ON DELETE CASCADE,
    UNIQUE(idGoal, idTrade)
);

-- ============================================================================
-- 6. TRIGGERS PARA CÁLCULO AUTOMÁTICO DE PNL E PNLPCT
-- ============================================================================

-- Trigger para o evento INSERT
CREATE TRIGGER trg_trades_calculate_pnl_insert
BEFORE INSERT ON trades
FOR EACH ROW
WHEN NEW.exitPrice IS NOT NULL AND NEW.entryPrice IS NOT NULL AND NEW.size IS NOT NULL
BEGIN
    SELECT 
        CASE 
            WHEN NEW.side = 'BUY' THEN
                SET NEW.pnl = (NEW.exitPrice - NEW.entryPrice) * NEW.size,
                NEW.pnlPct = ((NEW.exitPrice - NEW.entryPrice) / NEW.entryPrice) * 100
            WHEN NEW.side = 'SELL' THEN
                SET NEW.pnl = (NEW.entryPrice - NEW.exitPrice) * NEW.size,
                NEW.pnlPct = ((NEW.entryPrice - NEW.exitPrice) / NEW.entryPrice) * 100
        END;
END;

-- No SQLite não podemos usar 'SET NEW.coluna = valor' diretamente dentro de Triggers. 
-- A forma correta e elegante de mutar valores BEFORE no SQLite é recriando a lógica via subqueries/re-atribuição.
-- Vamos corrigir a abordagem para a sintaxe nativa do SQLite usando UPDATE no ID correspondente (alternativa padrão do SQLite):

DROP TRIGGER IF EXISTS trg_trades_calculate_pnl_insert;

-- Correção pragmática usando AFTER INSERT/UPDATE para atualizar a própria tabela de forma limpa:

CREATE TRIGGER trg_trades_calculate_pnl_after_insert
AFTER INSERT ON trades
WHEN NEW.exitPrice IS NOT NULL
BEGIN
    UPDATE trades
    SET pnl = CASE 
                WHEN NEW.side = 'BUY' THEN (NEW.exitPrice - NEW.entryPrice) * NEW.size
                ELSE (NEW.entryPrice - NEW.exitPrice) * NEW.size
              END,
        pnlPct = CASE 
                    WHEN NEW.side = 'BUY' THEN ((NEW.exitPrice - NEW.entryPrice) / NEW.entryPrice) * 100
                    ELSE ((NEW.entryPrice - NEW.exitPrice) / NEW.entryPrice) * 100
                 END
    WHERE id = NEW.id;
END;

---

CREATE TRIGGER trg_trades_calculate_pnl_after_update
AFTER UPDATE OF entryPrice, exitPrice, size, side ON trades
WHEN NEW.exitPrice IS NOT NULL
BEGIN
    UPDATE trades
    SET pnl = CASE 
                WHEN NEW.side = 'BUY' THEN (NEW.exitPrice - NEW.entryPrice) * NEW.size
                ELSE (NEW.entryPrice - NEW.exitPrice) * NEW.size
              END,
        pnlPct = CASE 
                    WHEN NEW.side = 'BUY' THEN ((NEW.exitPrice - NEW.entryPrice) / NEW.entryPrice) * 100
                    ELSE ((NEW.entryPrice - NEW.exitPrice) / NEW.entryPrice) * 100
                 END
    WHERE id = NEW.id;
END;