import React from 'react';
import styles from './GridLayout.module.css';
import { GridLayoutProps } from './api';
import { buildRowTemplate, buildColTemplate } from './utils';


export const GridLayout: React.FC<GridLayoutProps> = ({ children, columnWidths, rowHeights, height,outerStyles="",gridItemsAdditionalStyles, width }) => {
  const colTemplate = buildColTemplate(columnWidths);
  const rowTemplate = buildRowTemplate(rowHeights);

  const additionalStyles={
        gridTemplateColumns: colTemplate,
        gridTemplateRows: rowTemplate,
        height,
        width
      }

  return (
    <div
      className={`${styles.grid} ${outerStyles}`}
      style={additionalStyles}
    >
      {children.map((child, index) => (
        <div key={index} className={`${styles.grid__item} ${styles[`grid__item--${index + 1}`]} ${gridItemsAdditionalStyles?gridItemsAdditionalStyles[index]||"":""}`}>
          {child}
        </div>
      ))}
    </div>
  );
};

