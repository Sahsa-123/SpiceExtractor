import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ISLProps } from './api';
import { ISLStateAtom } from '../sharedState/ISLState';
import { useAtom } from 'jotai';
import styles from './ISL.module.css';
import { InputField } from '../../../../../../core/UI';

type Step = {
  name: string;
  index: number;
  id: string;
};

export const ISL: React.FC<ISLProps> = ({ config, syncFunc, outerStyles=null }) => {
  //Настройка сосояний
  const { endpoints } = config;
  const [currentState, setState] = useAtom(ISLStateAtom);
  const [selected, setSelected] = useState<Step | null>(null);
  //Настройка сосояний

  //Получение данных с сервера
  const { data: steps = [] } = useQuery<Step[]>({
    queryKey: ['steps'],
    queryFn: async () => {
      const res = await fetch(endpoints.getList);
      return res.json();
    },
    staleTime: Infinity,
  });
  //Получение данных с сервера

  // Настройка общения с сервером(обновления состояний)
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const url = new URL(endpoints.deleteEP, window.location.origin);
      url.searchParams.set('id', id);
      await fetch(url.toString(), { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
  });

  const changeOrderMutation = useMutation({
    mutationFn: async (steps: Step[]) => {
      await fetch(endpoints.changeOrderEP, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(steps),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newStep: { name: string; index: number }) => {
      await fetch(endpoints.addEP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStep),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
  });
  // Настройка общения с сервером(обновления состояний)

  //Поведение при выборе элемента
  const handleSelect = (step: Step) => {
    setSelected(step);
  };
  //Поведение при выборе элемента

  //Реакция на изменение состояния
  useEffect(() => {
    if (!selected){
      setState('stable');
    }

    else if (currentState === 'deleting') {
      deleteMutation.mutate(selected.id);
      setSelected(null);
      setState('stable');
    }

    else if (currentState === 'moovingUp') {
      const idx = steps.findIndex(s => s.id === selected.id);
      if (idx > 0) {
        const reordered = [...steps];
        [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];

        const updated = [
        { ...reordered[idx], index: idx },
        { ...reordered[idx - 1], index: idx - 1 },
        ];

        changeOrderMutation.mutate(updated);
      }
      setState('stable');
    }

    else if (currentState === 'moovingDown') {
      const idx = steps.findIndex(s => s.id === selected.id);
      if (idx < steps.length - 1 && idx >= 0) {
        const reordered = [...steps];
        [reordered[idx + 1], reordered[idx]] = [reordered[idx], reordered[idx + 1]];

        const updated = [
          { ...reordered[idx], index: idx },
          { ...reordered[idx + 1], index: idx + 1 },
        ];

        changeOrderMutation.mutate(updated);
      }
      setState('stable');
    }

  }, [currentState]);

  useEffect(() => {
    syncFunc(selected?.id ?? null); 
  }, [selected]);

  //Реакция на изменение состояния
  ///Настройка поля ввода
 const handleAdd = (val: string) => {
    if (!val.trim() || !selected) {
      setState('stable'); // просто свернём поле
      return;
    }

    addMutation.mutate(
      { name: val.trim(), index: selected.index + 1 },
      { onSuccess: () => setState('stable') }
    );
  };


  const inputFieldConfig = selected
  ? {
      placeholder: "Введите название нового шага",
      enterHandler: handleAdd,
      blurHandler: handleAdd,
      outerStyles: styles["ISL__input"],
    }
  : undefined;
  ///Настройка поля ввода


  return (
  <ul className={`${styles.ISL} ${outerStyles}`}>
    {steps.map((step) => (
      <React.Fragment key={step.id}>
        <li
          className={`${styles["ISL__elem"]} ${selected?.id === step.id ? styles['ISL__elem--selected'] : ''}`}
          onClick={() => handleSelect(step)}
        >
          {step.name}
        </li>

        {currentState === 'editing' && selected?.id === step.id && inputFieldConfig && (
          <li className={`${styles["ISL__elem"]} ${styles["ISL__elem--no-padding"]}`}>
            <InputField {...inputFieldConfig} />
          </li>
        )}


      </React.Fragment>
    ))}
  </ul>
);

};