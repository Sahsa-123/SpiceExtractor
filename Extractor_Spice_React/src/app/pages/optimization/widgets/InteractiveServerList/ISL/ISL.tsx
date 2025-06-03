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

export const ISL: React.FC<ISLProps> = ({ config, syncFunc, outerStyles = null, height, width }) => {
  const externalStyles = {height, width}
  const { endpoints } = config;
  const [currentState, setState] = useAtom(ISLStateAtom);
  const [selected, setSelected] = useState<Step | null>(null);

  const queryClient = useQueryClient();

  // 1. Получаем список шагов
  const { data: steps = [] } = useQuery<Step[]>({
    queryKey: ['steps'],
    queryFn: async () => {
      const res = await fetch(endpoints.getList);
      return res.json();
    },
    staleTime: Infinity,
  });

  // 2. Удаление шага
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const url = new URL(endpoints.deleteEP);
      url.searchParams.set('id', id);
      await fetch(url.toString(), { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
  });

  // 3. Изменение порядка
  const changeOrderMutation = useMutation({
    mutationFn: async (updatedSteps: Step[]) => {
      await fetch(endpoints.changeOrderEP, {
        method: 'POST', // ✅ PATCH, как теперь принято
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({steps:updatedSteps}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
  });

  // 4. Добавление шага
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

  const handleSelect = (step: Step) => {
    setSelected(step);
  };

  useEffect(() => {
    if (!selected) {
      if (currentState==="editing"){
        return
      }
      setState('stable');
    } else if (currentState === 'deleting') {
      deleteMutation.mutate(selected.id);
      setSelected(null);
      setState('stable');
    } else if (currentState === 'moovingUp') {
      const currentStep = steps.find(s => s.id === selected.id);
      if (!currentStep) return;

      const currentIndex = currentStep.index;
      const targetStep = steps.find(s => s.index === currentIndex - 1);

      if (targetStep) {
        const updated = [
          { ...targetStep, index: currentIndex },
          { ...currentStep, index: currentIndex - 1 },
        ];
        changeOrderMutation.mutate(updated);
      }

      setState('stable');

      } else if (currentState === 'moovingDown') {
        const currentStep = steps.find(s => s.id === selected.id);
        if (!currentStep) return;

        const currentIndex = currentStep.index;
        const targetStep = steps.find(s => s.index === currentIndex + 1);

        if (targetStep) {
          const updated = [
            { ...currentStep, index: currentIndex + 1 },
            { ...targetStep, index: currentIndex },
          ];
          changeOrderMutation.mutate(updated);
        }

    setState('stable');
  }

  }, [currentState]);

  useEffect(() => {
    syncFunc(selected?.id ?? null);
  }, [selected]);

  // Добавление через поле
  const handleAdd = (val: string) => {
    if(steps.length===0){
      if(!val.trim()){
        setState("stable")
        return
      }
      else{
        addMutation.mutate(
            { name: val.trim(), index: 0 },
            { onSuccess: () => setState('stable') }
          );
      }
    }else{
      if(!val.trim()){
        setState('stable');
        return;
      }
      else if(!selected){
        addMutation.mutate(
          { name: val.trim(), index: 0 },
          { onSuccess: () => setState('stable') }
        );
      }
      else{
        addMutation.mutate(
          { name: val.trim(), index: selected.index + 1 },
          { onSuccess: () => setState('stable') }
        );  
      }
    }
  };

  const inputFieldConfig = currentState==="editing"
    ? {
        placeholder: 'Введите название нового шага',
        enterHandler: handleAdd,
        blurHandler: handleAdd,
        outerStyles: styles["ISL__input"],
      }
    : undefined;

  return (
    <ul style={ externalStyles} className={`${styles.ISL} ${outerStyles}`}>
      {
      !selected&&currentState==="editing"?
        <li className={`${styles["ISL__elem"]} ${styles["ISL__elem--no-padding"]}`}>
          <InputField {...inputFieldConfig} />
        </li>
        :
        null
      }
      {[...steps].sort((a, b) => a.index - b.index).map((step) => (
        <React.Fragment key={step.id}>
          <li
            title={step.name}
            className={`${styles["ISL__elem"]} ${
              selected?.id === step.id ? styles['ISL__elem--selected'] : ''
            }`}
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
      ))
      }
    </ul>
  );
};

