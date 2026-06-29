# Tabelas de Suporte (Cadastros Base)
```
colors      (id, name, hexColor)
accounts    (id, name, description?)
timeframes  (id, name, description?)
markets     (id, name, description?)
symbols     (id, name, ticker, idMarket, description?)
```

---

# Regras, Estratégias e Setups
```
strategies  (id, name, description, idColor)
setups      (id, name, description, idColor)
principles  (id, idStrategy, name, description?)
rules       (id, idSetup, name, description?)
```

---

# Tabelas de Tags (Muitos-para-Muitos com Trades)
```
error_tags  (id, name, type, description?)
emotions    (id, name, type, description?)
goals       (id, name, type, description?)
```

# Tabelas Pivot / Relacionais (Muitos-para-Muitos e Mídia)
```
images            (id, idTrade, url)
timeframes_setups (id, idTimeframe, idSetup)
markets_setups    (id, idMarket, idSetup)
emotions_trades   (id, idEmotion, idTrade)
error_tags_trades (id, idErrorTag, idTrade)
goals_trades      (id, idGoal, idTrade)
```

# A Tabela Central
```
trades      (id, idAccount, entryDate, idSymbol, side, idTimeframe, exitDate, entryPrice, exitPrice, size, stopLoss, takeProfit, pnl, pnlPct, idStrategy, idSetup, status, note)
```

## TRIGGERS
```
pnl       (trades)
pnlPct   (trades)
```

Dica sobre as Triggers (pnl e pnlPct): > Lembre-se de criar a trigger para o evento BEFORE UPDATE e BEFORE INSERT. Assim, toda vez que o exitPrice ou exitDate for preenchido/alterado, o cálculo roda automaticamente antes de salvar no banco.