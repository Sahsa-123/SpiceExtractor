import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ISLProps } from './api';
import { ISLStateAtom } from '../sharedState/ISLState';
import { useAtom } from 'jotai';
import styles from './ISL.module.css';
import { InputField } from '../../../../../../core/UI';
import { CenteredContainer } from '../../../../../../core/Wrappers';
import { z } from 'zod';
import { GETRequest, JSONResponseConverter, validateWithZodSchema } from '../../../../../../core/webAPI';
import { Loader, parentStyles } from '../../../../../../core/UI/Loader';
import { BadNetwork, ServerStatusError } from '../../../../../../core/webAPI/Requests/errors';

type Step = {
  name: string;
  index: number;
  id: string;
};

const StepSchema = z.object({
  name: z.string(),
  index: z.number(),
  id: z.string(),
});

const StepsListSchema = z.array(StepSchema);
export const ISL: React.FC<ISLProps> = ({ config, syncFunc, outerStyles = null, height, width }) => {
  const externalStyles = {height, width}
  const { endpoints } = config;
  const [currentState, setState] = useAtom(ISLStateAtom);
  const [selected, setSelected] = useState<Step | null>(null);

  const queryClient = useQueryClient();

  // 1. Получаем список шагов
  const { 
    data: steps = [],
    isError,
    isLoading,
    error
   } = useQuery<Step[]>({
    queryKey: ['steps'],
    queryFn: async () => {
      const res = await GETRequest(config.host, config.endpoints.getList);
      if (!res.isSuccessful) throw res.data;

      const json = await JSONResponseConverter(res.data);
      if (!json.isSuccessful) throw json.data;

      const validated = validateWithZodSchema({
        data: json.data,
        schema: StepsListSchema,
      });

      if (!validated.isSuccessful) throw validated.data;
      return validated.data;
  },
    staleTime: Infinity,
  });

  // 2. Удаление шага
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
    const url = new URL(endpoints.deleteEP, config.host);  
      url.searchParams.set('id', id);
      await fetch(url.toString(), { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
    onError: ()=>alert("Произошла непредвиденная ошибка, повторите операцию позже")
  });

  // 3. Изменение порядка
  const changeOrderMutation = useMutation({
    mutationFn: async (updatedSteps: Step[]) => {
      await fetch(new URL(endpoints.changeOrderEP, config.host), {
        method: 'POST', // ✅ PATCH, как теперь принято
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({steps:updatedSteps}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
    onError: ()=>alert("Произошла непредвиденная ошибка, повторите операцию позже")
  });

  // 4. Добавление шага
  const addMutation = useMutation({
    mutationFn: async (newStep: { name: string; index: number }) => {
      await fetch(new URL(endpoints.addEP, config.host), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStep),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
    onError: ()=>alert("Произошла непредвиденная ошибка, повторите операцию позже")
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
  if (isLoading) {
    return (
      <div className={parentStyles} style={{height:'100%' ,width:"100%"}}>
        <Loader visible={true}/>
      </div>
    );
  }

  if (isError) {
    let message = ""
    if (error instanceof ServerStatusError) {
      message = "Сервер временно недоступен";
    } else if (error instanceof BadNetwork) {
      message = "Проверьте интернет-соединение";
    } else {
      message = "Попробуйте позже";
    }
    return(
      <CenteredContainer flexDirection="column" width="100%" height="100%">
        <span>Ошибка загрузки</span>
        {message}
      </CenteredContainer>
    )
  }


  const inputFieldConfig = currentState==="editing"
    ? {
        placeholder: 'Введите название нового шага',
        enterHandler: handleAdd,
        blurHandler: handleAdd,
        outerStyles: styles["ISL__input"],
      }
    : undefined;
  if (steps.length === 0 && currentState !== "editing") {
    return (
      <CenteredContainer {...externalStyles} width='100%'>
        <span>Добавьте шаг</span>
      </CenteredContainer>
    );
  }

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

