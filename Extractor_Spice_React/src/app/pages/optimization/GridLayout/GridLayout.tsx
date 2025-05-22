import React from 'react';
import styles from './GridLayout.module.css';
import { GridLayoutProps } from './api';
import { buildRowTemplate, buildColTemplate } from './utils';


export const GridLayout: React.FC<GridLayoutProps> = ({ children, columnWidths, rowHeights }) => {
  const colTemplate = buildColTemplate(columnWidths);
  const rowTemplate = buildRowTemplate(rowHeights);

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: colTemplate,
        gridTemplateRows: rowTemplate,
      }}>
      {children.map((child, index) => (
        <div key={index} className={`${styles.grid__item} ${styles[`grid__item--${index + 1}`]}`}>
          {child}
        </div>
      ))}
    </div>
  );
};

