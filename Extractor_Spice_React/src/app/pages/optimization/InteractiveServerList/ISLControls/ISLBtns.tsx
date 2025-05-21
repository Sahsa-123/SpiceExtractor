import React from 'react';
import { useSetAtom } from 'jotai';
import { ISLStateAtom } from '../sharedState/ISLState';
import { Button } from '../../../../../core/UI'; 

export const AddButton: React.FC = () => {
  const setState = useSetAtom(ISLStateAtom);
  return (
    <Button clickHandler={() => setState("editing")}>
      Добавить
    </Button>
  );
};

export const DeleteButton: React.FC = () => {
  const setState = useSetAtom(ISLStateAtom);
  return (
    <Button clickHandler={() => setState("deleting")}>
      Удалить
    </Button>
  );
};

export const MoveUpButton: React.FC = () => {
  const setState = useSetAtom(ISLStateAtom);
  return (
    <Button clickHandler={() => setState("moovingUp")}>
      Поднять
    </Button>
  );
};

export const MoveDownButton: React.FC = () => {
  const setState = useSetAtom(ISLStateAtom);
  return (
    <Button clickHandler={() => setState("moovingDown")}>
      Опустить
    </Button>
  );
};