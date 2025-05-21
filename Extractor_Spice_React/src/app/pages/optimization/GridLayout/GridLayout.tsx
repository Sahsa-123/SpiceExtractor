import React from 'react';
import styles from './GridLayout.module.css';
import { GridLayoutProps } from './api';

export const GridLayout: React.FC<GridLayoutProps> = ({ children }) => {
  return (
    <div className={styles.grid}>
      {children.map((child, index) => (
        <div key={index} className={`${styles.grid__item} ${styles[`grid__item--${index + 1}`]}`}>
          {child}
        </div>
      ))}
    </div>
  );
};
