import React from 'react';
import { useSetAtom } from 'jotai';
import { graphAtom } from "../../sharedState";
import { RunStepButtonProps } from './api';
import { Button } from '../../../../../../../core/UI';

export const RunStepButton: React.FC<RunStepButtonProps> = ({ endpoint, stepId }) => {
  const setGraph = useSetAtom(graphAtom);

  const handleClick = async () => {
    const res = await fetch(`${endpoint}?id=${stepId}`);
    const data = await res.json();
    setGraph(data);
  };

  return <Button clickHandler={handleClick}>Запустить шаг</Button>;
};
