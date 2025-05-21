import React from 'react';
import { useSetAtom } from 'jotai';
import { graphAtom } from '../../sharedState';
import { ModelButtonProps } from './api';
import { Button } from '../../../../../../core/UI';

export const ModelButton: React.FC<ModelButtonProps> = ({ endpoint }) => {
  const setGraph = useSetAtom(graphAtom);

  const handleClick = async () => {
    const res = await fetch(endpoint);
    const data = await res.json();
    setGraph(data);
  };

  return <Button clickHandler={handleClick}>Смоделировать</Button>;
};
