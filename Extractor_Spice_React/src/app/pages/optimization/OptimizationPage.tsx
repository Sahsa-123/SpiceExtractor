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

export const OptimizationPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mockConfig = {
    config: {
      endpoints: {
        getList: "http://localhost:4000/steps",
        addEP: "http://localhost:4000/steps/add",
        deleteEP: "http://localhost:4000/steps/delete",
        changeOrderEP: "http://localhost:4000/steps/changeIndex"
      }
    },
    syncFunc: setSelectedId,
    outerStyles: styles["optimization__steps"]
  };

  const mockStepsCharactFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/charact",
        post: "steps/charact"
      }
    }
  };

  const mockStopFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/stopcond",
        post: "steps/stopcond"
      }
    }
  };

  return (
    <GridLayout columnWidths={[1.5, 1, 2]} rowHeights={[1.5, 1]}>
      <ISL {...mockConfig} />

      <CenteredContainer flexDirection="column">
        <AddButton />
        <DeleteButton />
        <MoveUpButton />
        <MoveDownButton />
        <RunStepButton
          endpoint="http://localhost:4000/steps/runStep"
          stepId={selectedId || ""}
        />
        <ModelButton endpoint="http://localhost:4000/steps/model" />
      </CenteredContainer>

      <PageCrowler
        pages={{
          "Характеристики": selectedId
            ? (
              <StepsCharactForm
                stepId={selectedId}
                {...mockStepsCharactFormConfig}
              />
            )
            : <div>Выберите шаг</div>,

          "Условия остановки": selectedId
            ? (
              <StopForm
                stepId={selectedId}
                {...mockStopFormConfig}
              />
            )
            : <div>Выберите шаг</div>
        }}
      />

      <CPlot />
    </GridLayout>
  );
};
