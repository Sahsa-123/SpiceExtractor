import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { graphAtom } from '../sharedState';
import Plot from 'react-plotly.js';
import styles from './CPlot.module.css';

export const CPlot: React.FC = () => {
  const graph = useAtomValue(graphAtom);

  useEffect(() => {
    if (graph?.message) {
      alert(graph.message);
    }
  }, [graph?.message]);

  return (
    <div className={styles.cplot}>
      {graph ? (
        <>
          <div className={styles.cplot__item}>
            <Plot
              data={graph.layoutIDVD.data}
              layout={graph.layoutIDVD.layout}
              className={styles.cplot__plot}
            />
            <span className={styles.cplot__error}>{graph.errIDVD}%</span>
          </div>
          <div className={styles.cplot__item}>
            <Plot
              data={graph.layoutIDVG.data}
              layout={graph.layoutIDVG.layout}
              className={styles.cplot__plot}
            />
            <span className={styles.cplot__error}>{graph.errIDVG}%</span>
          </div>
        </>
      ) : (
        <div>Нет данных</div>
      )}
    </div>
  );
};
