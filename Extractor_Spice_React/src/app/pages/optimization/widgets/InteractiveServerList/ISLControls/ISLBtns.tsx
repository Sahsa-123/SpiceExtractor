import React from 'react';
import { useAtom } from 'jotai';
import { ISLStateAtom } from '../sharedState/ISLState';
import { Button } from '../../../../../../core/UI'; 

export const AddButton: React.FC = () => {
  const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button disabled={state!=="stable"} clickHandler={() => setState("editing")}>
      Добавить
    </Button>
  );
};

export const DeleteButton: React.FC = () => {
  const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button disabled={state!=="stable"} clickHandler={() => setState("deleting")}>
      Удалить
    </Button>
  );
};

export const MoveUpButton: React.FC = () => {
  const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button  disabled={state!=="stable"} clickHandler={() => setState("moovingUp")}>
      Поднять
    </Button>
  );
};

export const MoveDownButton: React.FC = () => {
  const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button  disabled={state!=="stable"} clickHandler={() => setState("moovingDown")}>
      Опустить
    </Button>
  );
};