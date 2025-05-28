import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { graphAtom } from '../sharedState';
import Plot from 'react-plotly.js';
import styles from './CPlot.module.css';
import { CPlotI } from './api';
import { CenteredContainer } from '../../../../../../core/Wrappers';

export const CPlot: React.FC<CPlotI> = ({ height, width, outerStyles }) => {
  const additionalStyles = {
    height,
    width,
  };

  const { data, isError } = useAtomValue(graphAtom);
  /*Уведомляем пользователя о рещультатах моделирования*/
  useEffect(() => {
    if (data?.message) {
      alert(data.message);
    }
  }, [data?.message]);
  /*Уведомляем пользователя о рещультатах моделирования*/

  if (isError) {
    return (
      <CenteredContainer {...additionalStyles} flexDirection="column">
        <span>Ошибка загрузки графика</span>
        <span>Проверьте параметры и попробуйте снова</span>
      </CenteredContainer>
    );
  }

  if (!data) {
    return (
      <CenteredContainer {...additionalStyles} flexDirection="column">
        <span>Запустите шаг</span>
        <span>или</span>
        <span>проведите моделирование</span>
      </CenteredContainer>
    );
  }


  const plots = [
    {
      key: 'IDVD',
      data: data.layoutIDVD.data,
      layout: data.layoutIDVD.layout,
      error: data.errIDVD,
    },
    {
      key: 'IDVG',
      data: data.layoutIDVG.data,
      layout: data.layoutIDVG.layout,
      error: data.errIDVG,
    },
  ];

  return (
    <div style={additionalStyles} className={`${styles.cplot} ${outerStyles || ''}`}>
      {plots.map(({ key, data, layout, error }) => (
        <div key={key} className={styles.cplot__item}>
          <Plot
            data={data}
            layout={{
              ...layout,
              title: {
                text: key,
                x: 0.5,
                xanchor: 'center',
                font: { size: 16 },
              },
              margin: {
                t: 60,
                ...(layout?.margin || {}),
              },
            }}
            className={styles.cplot__plot}
            config={{ responsive: true, displaylogo: false }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
          <span className={styles.cplot__error}>
            err: {Math.round(error * 100) / 100}%
          </span>
        </div>
      ))}
    </div>
  );
};
