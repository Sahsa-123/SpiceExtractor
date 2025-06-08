import React, { useState } from 'react';
import { PageCrowlerProps } from './api';
import styles from './PageCrowler.module.css';

export const PageCrowler: React.FC<PageCrowlerProps> = ({ pages, outerStyles="", height, width }) => {
  const keys = Object.keys(pages);
  const [activeKey, setActiveKey] = useState(keys[0] || '');
  const externalStyles={height, width}

  return (
    <div className={`${styles.crowler} ${outerStyles||""}`} style={externalStyles}>
      <div className={styles.tabs}>
        {keys.map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${key === activeKey ? styles["tab--active"] : ''}`}
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
