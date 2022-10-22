import React, { useState } from "react";
import './styles/index.scss';
import styles from './ReactSampleApp.module.scss';

export const ReactSampleApp: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className={styles.root}>
      <>counter: {counter}</>
      <div onClick={() => setCounter(prev => prev + 1)}> + </div>
    </div>
  )
};
