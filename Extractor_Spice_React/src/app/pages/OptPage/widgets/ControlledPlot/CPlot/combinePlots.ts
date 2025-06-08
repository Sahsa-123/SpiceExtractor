import { PlotData } from "../sharedState";

type SourceKey = "measurements" | "model";

type CombineInput = {
  name: string | null;
  measurements: PlotData | null;
  model: PlotData | null;
};

export function combinePlots({ name, measurements, model }: CombineInput): PlotData | null {
  const sources: [PlotData | null, SourceKey][] = [
    [measurements, "measurements"],
    [model, "model"],
  ];

  const nonNullSources = sources.filter(([plot]) => plot !== null) as [PlotData, SourceKey][];

  if (nonNullSources.length === 0) return null;

  const label = (key: SourceKey) => (key === "measurements" ? "empiric" : key);

  const makeTitle = (id: "IDVD" | "IDVG") =>
    `${id}<br>${name || "—"}`;

  const build = (id: "pointIDVD" | "pointIDVG", title: string) => {
    return {
      data: nonNullSources.flatMap(([plot, key]) =>
        plot[id].data.map((trace) => ({
          ...trace,
          name: label(key),
        }))
      ),
      layout: {
        ...nonNullSources[0][0][id].layout,
        title: {
          text: title,
          x: 0.5,
          xanchor: "center",
          font: { size: 16 },
        },
        margin: { t: 60 },
      },
    };
  };

  return {
    pointIDVD: build("pointIDVD", makeTitle("IDVD")),
    pointIDVG: build("pointIDVG", makeTitle("IDVG")),
    errIDVD: undefined,
    errIDVG: undefined,
  };
}
