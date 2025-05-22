import React, { useState } from 'react';
import { CenteredContainer } from "../../../core/Wrappers";
import { ISL } from "./widgets/InteractiveServerList";
import { AddButton, DeleteButton } from "./widgets/InteractiveServerList";
import { RunStepButton, ModelButton, CPlot } from "./widgets/ControlledPlot";
import { GridLayout } from './GridLayout';
import styles from "./OptimizationPage.module.css"
import { PageCrowler } from './widgets/PageCrowler';
import { StepsCharactForm } from './widgets/Forms';

export const OptimizationPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mockConfig = {
    config: {
        endpoints: {
          getList: "http://localhost:4000/steps",
          addEP: "http://localhost:4000/steps/add",
          deleteEP: "http://localhost:4000/steps/delete",
          changeOrderEP: "http://localhost:4000/steps/changeOrder", // пока заглушка, можно добавить
        }
    },
    syncFunc: setSelectedId,
    outerStyles : styles["optimization__steps"]
  };

  return (
      <GridLayout columnWidths={[1.5, 1, 2]} rowHeights={[1.5, 1]}>
      <ISL {...mockConfig} />

      <CenteredContainer flexDirection="column">
        <AddButton />
        <DeleteButton />
        <RunStepButton
          endpoint="http://localhost:4000/steps/runStep"
          stepId={selectedId || ""}
        />
        <ModelButton
          endpoint="http://localhost:4000/steps/model"
        />
      </CenteredContainer>

      <PageCrowler
        pages={{
          "Условие остановки": selectedId
            ? <StepsCharactForm stepId={selectedId} />
            : <div>Выберите шаг</div>
        }}
      />

      <CPlot />
    </GridLayout>

  );
};
