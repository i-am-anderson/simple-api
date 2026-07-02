import account from "../mocks/account.mock.json" with { type: "json" };
import color from "../mocks/color.mock.json" with { type: "json" };
import market from "../mocks/market.mock.json" with { type: "json" };
import symbol from "../mocks/symbol.mock.json" with { type: "json" };
import timeframe from "../mocks/timeframe.mock.json" with { type: "json" };
import setup from "../mocks/setup.mock.json" with { type: "json" };
import strategy from "../mocks/strategy.mock.json" with { type: "json" };
// import rule from "../mocks/rule.mock.json" with { type: "json" };
// import principle from "../mocks/principle.mock.json" with { type: "json" };

const arr = [
  { data: account, resource: "accounts" },
  { data: color, resource: "colors" },
  { data: market, resource: "markets" },
  { data: symbol, resource: "symbols" },
  { data: timeframe, resource: "timeframes" },
  { data: setup, resource: "setups" },
  { data: strategy, resource: "strategies" },
  // { data: rule, resource: "rules" },
  // { data: principle, resource: "principles" },
];

async function collectionRequest(data, resource) {
  const url = `http://localhost:3600/api/v1/${resource}`;

  const payloads = Array.isArray(data) ? data : [data];

  for (const payload of payloads) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Success [${resource}]:`, result);
    } catch (error) {
      console.error(`Error [${resource}]:`, error.message);
    }
  }
}

async function run() {
  console.log("### START ###");

  for (const item of arr) {
    await collectionRequest(item.data, item.resource);
  }

  console.log("### END ###");
}

run();
