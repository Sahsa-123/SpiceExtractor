const generateParams = (count) => {
  const params = {};
  for (let i = 1; i <= count; i++) {
    const value = +(Math.random() * 10).toFixed(2);
    params[`param${i}`] = {
      checked: Math.random() > 0.5,
      value,
      min: +(value - 2).toFixed(2),
      max: +(value + 2).toFixed(2),
    };
  }
  return params;
};

const generateCharact = () => ({
  IDVD: {
    checked: true,
    xmin: 0,
    xmax: +(5 + Math.random() * 5).toFixed(1),
    ymin: 0,
    ymax: +(10 + Math.random() * 5).toFixed(1),
  },
  IDVG: {
    checked: true,
    xmin: -2,
    xmax: 2,
    ymin: -1,
    ymax: +(1 + Math.random() * 2).toFixed(1),
  },
});

const generatePlot = (id) => {
  const x = Array.from({ length: 100 }, (_, i) => +(i / 10).toFixed(1));
  const y1 = x.map(v => +(Math.sin(v) + Math.random() * 0.2).toFixed(2));
  const y2 = x.map(v => +(0.1 * v ** 2 + Math.random() * 0.5).toFixed(2));

  return {
    layoutIDVD: {
      data: [{ x, y: y1, type: "scatter", name: `IDVD ${id}` }],
      layout: { title: `IDVD Step ${id}` },
    },
    errIDVD: +(Math.random() * 100).toFixed(1),
    layoutIDVG: {
      data: [{ x, y: y2, type: "scatter", name: `IDVG ${id}` }],
      layout: { title: `IDVG Step ${id}` },
    },
    errIDVG: +(Math.random() * 100).toFixed(1),
    message: `Step ${id} executed (mock)`,
  };
};

const steps = [];
const paramTables = {};
const charactTables = {};
const plotData = {};
const stopCondTables = {};

for (let i = 0; i < 20; i++) {
  const id = `s${i + 1}`;
  steps.push({
    id,
    name: `Step ${i + 1}`,
    index: i,
  });
  paramTables[id] = generateParams(10 + Math.floor(Math.random() * 10));
  charactTables[id] = generateCharact();
  plotData[id] = generatePlot(id);
  stopCondTables[id] = {
    iterNum: 100 + i * 10,
    relMesErr: +(Math.random() * 5).toFixed(2),
    absMesErr: +(Math.random()).toFixed(3),
    paramDelt: +(Math.random() * 10).toFixed(2),
  };
}

const globalParams = {
  threshold: { value: 0.5, min: 0.1, max: 1.0 },
  scale: { value: 1.0, min: 0.0, max: 10.0 },
};

module.exports = {
  steps,
  paramTables,
  charactTables,
  stopCondTables,
  plotData,
  globalParams,
};
