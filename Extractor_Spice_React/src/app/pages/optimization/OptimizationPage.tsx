import React, { useState } from 'react';
import { CenteredContainer } from "../../../core/Wrappers";
import { ISL } from "./InteractiveServerList";
import { AddButton, DeleteButton } from "./InteractiveServerList";
import { RunStepButton, ModelButton, CPlot } from "./ControlledPlot";
import { GridLayout } from './GridLayout';

export const OptimizationPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mockConfig = {
    config: {
      endpoints: {
        getList: "http://localhost:4000/mock/getList",
        addEP: "http://localhost:4000/mock/add",
        deleteEP: "http://localhost:4000/mock/delete",
        changeOrderEP: "http://localhost:4000/mock/changeOrder",
      }
    },
    syncFunc: setSelectedId
  };

  return (
      <GridLayout>
        <ISL {...mockConfig} />

        <CenteredContainer flexDirection='column'>
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
        

        <div>
          Пока что разрабатываем
        </div>

        <CPlot />
      </GridLayout>
  );
};
