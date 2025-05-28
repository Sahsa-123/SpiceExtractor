import React, { useState } from 'react';
import { CenteredContainer } from "../../../core/Wrappers";
import {
  ISL,
  AddButton,
  DeleteButton,
  MoveUpButton,
  MoveDownButton,
} from "./widgets/InteractiveServerList";
import {
  RunStepButton,
  ModelButton,
  CPlot,
} from "./widgets/ControlledPlot";
import { GridLayout } from './GridLayout';
import styles from "./OptimizationPage.module.css";
import { PageCrowler } from './widgets/PageCrowler';
import {
  StepsCharactForm,
  StopForm
} from './widgets/Forms';
import { ParamsForm } from './widgets/ParamsForm';

export const OptimizationPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mockConfig = {
    config: {
      endpoints: {
        getList: "http://localhost:4000/steps",
        addEP: "http://localhost:4000/steps/add",
        deleteEP: "http://localhost:4000/steps/delete",
        changeOrderEP: "http://localhost:4000/steps/changeIndex"
      },
    },
    syncFunc: setSelectedId,
    height:"100%" as `${number}%`,
    width:"auto" as const,
    outerStyles: styles["optimization__steps"]
  };
  const mockRunStepConfig = {
  config: {
    host: "http://localhost:4000",
    endpoint: "steps/runStep"
  }
};

const mockModelConfig = {
  config: {
    host: "http://localhost:4000",
    endpoint: "steps/model"
  }
};

  const mockStepsCharactFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/charact",
        post: "steps/charact"
      }
    },
    height:"100%" as `${number}%`,
    width:"100%" as `${number}%`,
    outerStyles:styles["optimization__charact"],
  };

  const mockStopFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/stopcond",
        post: "steps/stopcond"
      }
    },
    height:"100%" as `${number}%`,
    width:"100%" as `${number}%`,
  };

  const mockLocalParamsFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/param",
        post: "steps/param"
      },
      stepId: "", // будет переопределяться через selectedId
    },
  };


  return (
    <GridLayout 
      gridItemsAdditionalStyles={[styles["optimization__grid-item"],  styles["optimization__grid-item"], null, styles["optimization__grid-item"]]} 
      outerStyles={styles["optimization"]} 
      height={"100%" as `${number}%`}
      width={"100%" as `${number}%`} 
      columnWidths={[1,"auto",2]} 
      rowHeights={[1, 1.4]}
    >
      <ISL {...mockConfig} outerStyles={styles["optimization__steps"]} />


      <div className={styles["optimization__btnsList"]}>
        <AddButton />
        <DeleteButton />
        <MoveUpButton />
        <MoveDownButton />
<RunStepButton
  stepId={selectedId || ""}
  {...mockRunStepConfig}
/>
<ModelButton {...mockModelConfig} />
        
        <AddButton />
        <DeleteButton />
        <MoveUpButton />
        <MoveDownButton />
<RunStepButton
  stepId={selectedId || ""}
  {...mockRunStepConfig}
/>
<ModelButton {...mockModelConfig} />

      </div>

      <PageCrowler outerStyles={styles["optimization__crowler"]} height='100%'  
      width={"100%"}
        pages={{
          "Характеристики": selectedId
            ? (
              <StepsCharactForm stepId={selectedId}
                {...mockStepsCharactFormConfig}
              />
            )
            : <CenteredContainer width='100%' height='100%'>Выберите шаг</CenteredContainer>,

          "Условия остановки": selectedId
            ? (
              <StopForm   stepId={selectedId}
                {...mockStopFormConfig}
              />
            )
            : <CenteredContainer width='100%' height='100%'>Выберите шаг</CenteredContainer>,

          "Локальные параметры": selectedId ? (
          <ParamsForm
            height='100%'
            width='100%'
            variant="local"
            outerStyles={styles["optimization__local-params"]}
            config={{
              ...mockLocalParamsFormConfig.config,
              stepId: selectedId
            }}
          />
        ) : <CenteredContainer width='100%' height='100%'>Выберите шаг</CenteredContainer>,

          }}
      />

      <CPlot width="100%" height='100%'/>
    </GridLayout>
  );
};
