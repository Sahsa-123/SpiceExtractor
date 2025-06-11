import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import { graphStateAtom, isGraphFetchingAtom } from "../sharedState";
import Plot from "react-plotly.js";
import styles from "./CPlot.module.css";
import { CPlotI } from "./api";
import { CenteredContainer } from "../../../../../../core/Wrappers";
import { Loader, parentStyles } from "../../../../../../core/UI/Loader";
import { combinePlots } from "./combinePlots";

export const CPlot: React.FC<CPlotI> = ({ height, width, outerStyles }) => {
  const additionalStyles = {
    height,
    width,
    position: "relative" as const,
  };

  const { measurements, model, name } = useAtomValue(graphStateAtom);
  const isFetching = useAtomValue(isGraphFetchingAtom);

  const combined = combinePlots({ measurements, model, name });
  const message = model?.message

  useEffect(() => {
    if (message) alert(message);
  }, [message]);

  if (!combined) {
    return (
      <CenteredContainer {...additionalStyles}  height="99%" overflow="hidden" flexDirection="column">
        {isFetching ? (
          <Loader visible />
        ) : (
          <>
            <span>Запустите шаг</span>
            <span>или</span>
            <span>проведите моделирование</span>
          </>
        )}
      </CenteredContainer>
    );
  }

  const plots = [
    {
      key: "IDVD",
      data: combined.pointIDVD.data,
      layout: combined.pointIDVD.layout,
      error: combined.errIDVD ?? 0,
    },
    {
      key: "IDVG",
      data: combined.pointIDVG.data,
      layout: combined.pointIDVG.layout,
      error: combined.errIDVG ?? 0,
    },
  ];

  return (
    <div
      style={additionalStyles}
      className={`${styles.cplot} ${outerStyles || ""} ${parentStyles}`}
    >
      {plots.map(({ key, data, layout, error }) => (
        <div key={key} className={styles.cplot__item}>
          <Plot
            data={data}
            layout={layout}
            className={styles.cplot__plot}
            config={{ responsive: true, displaylogo: false }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
          <span className={styles.cplot__error}>
            err: {Math.round(error * 100) / 100}%
          </span>
        </div>
      ))}
      <Loader visible={isFetching} />
    </div>
  );
};
