import React, { useState } from 'react';
import { PageCrowlerProps } from './api';
import styles from './PageCrowler.module.css';

export const PageCrowler: React.FC<PageCrowlerProps> = ({ pages }) => {
  const keys = Object.keys(pages);
  const [activeKey, setActiveKey] = useState(keys[0] || '');

  return (
    <div className={styles.crowler}>
      <div className={styles.tabs}>
        {keys.map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${key === activeKey ? styles.active : ''}`}
            onClick={() => setActiveKey(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {pages[activeKey]}
      </div>
    </div>
  );
};
