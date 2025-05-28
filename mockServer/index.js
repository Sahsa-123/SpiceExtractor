const express = require("express");
const cors = require("cors");
const {
  steps,
  paramTables,
  charactTables,
  stopCondTables,
  plotData,
  globalParams
} = require("./mockData");

const app = express();
app.use(cors());
app.use(express.json());

// Steps
app.get("/steps", (req, res) => {
  res.json(steps);
});

app.get("/steps/param", (req, res) => {
  const step = paramTables[req.query.id];
  res.json(step || {});
});

app.post("/steps/param", (req, res) => {
  paramTables[req.query.id] = req.body;
  res.json({ status: "ok" });
});

app.get("/steps/charact", (req, res) => {
  const step = charactTables[req.query.id];
  res.json(step || {});
});

app.post("/steps/charact", (req, res) => {
  charactTables[req.query.id] = req.body;
  res.json({ status: "ok" });
});

app.get("/steps/stopcond", (req, res) => {
  const step = stopCondTables[req.query.id];
  res.json(step || {});
});

app.post("/steps/stopcond", (req, res) => {
  stopCondTables[req.query.id] = req.body;
  res.json({ status: "ok" });
});

app.post("/steps/add", (req, res) => {
  const id = `s${Date.now()}`;
  const newStep = { id, index: steps.length, name: req.body.name || id };
  steps.push(newStep);
  paramTables[id] = {};
  charactTables[id] = {};
  stopCondTables[id] = {};
  res.json(newStep);
});

app.delete("/steps/delete", (req, res) => {
  const id = req.query.id;
  const index = steps.findIndex(s => s.id === id);
  if (index !== -1) {
    steps.splice(index, 1);
    delete paramTables[id];
    delete charactTables[id];
    delete stopCondTables[id];
    delete plotData[id];
    res.json({ status: "deleted" });
  } else {
    res.json({ status: "not found" });
  }
});

app.patch("/steps/changeIndex", (req, res) => {
  const updates = req.body;
  for (const { id, index } of updates) {
    const step = steps.find(s => s.id === id);
    if (step) step.index = index;
  }
  steps.sort((a, b) => a.index - b.index);
  res.json({ status: "indexes updated" });
});

app.get("/steps/runStep", (req, res) => {
  const result = plotData[req.query.id];
  res.json(result || {});
});

const generateDynamicPlot = () => {
  const x = Array.from({ length: 100 }, (_, i) => +(i / 10).toFixed(1));
  const y1 = x.map(v => +(Math.sin(v + Math.random()) + Math.random() * 0.5).toFixed(2));
  const y2 = x.map(v => +(Math.log1p(v) + Math.random()).toFixed(2));

  return {
    layoutIDVD: {
      data: [{ x, y: y1, type: "scatter", name: `Model IDVD` }],
      layout: { title: `Model IDVD` },
    },
    errIDVD: +(Math.random() * 100).toFixed(1),
    layoutIDVG: {
      data: [{ x, y: y2, type: "scatter", name: `Model IDVG` }],
      layout: { title: `Model IDVG` },
    },
    errIDVG: +(Math.random() * 100).toFixed(1),
    message: `Model simulation complete (mock).`,
  };
};

app.get("/steps/model", (req, res) => {
  res.json(generateDynamicPlot());
});


// Global Params
app.get("/paramTable/get", (req, res) => {
  res.json(globalParams);
});

app.post("/paramTable/update", (req, res) => {
  Object.assign(globalParams, req.body);
  res.json({ status: "ok" });
});

// Upload mock
app.post("/addFiles", (req, res) => {
  res.json(plotData["s2"] || {});
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Mock API running at http://localhost:${PORT}`);
});
