import React, { useState } from 'react';
import { CenteredContainer } from "../../../core/Wrappers";

/* Widgets */
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
import { UploadDataBtn } from "./widgets/ControlledPlot/PlotControllers/Upload";
import { PageCrowler } from './widgets/PageCrowler';
import {
  StepsCharactForm,
  StopForm
} from './widgets/Forms';
import { ParamsForm } from './widgets/ParamsForm';
import { GridLayout } from './GridLayout';

/* Styles */
import styles from "./OptimizationPage.module.css";

export const OptimizationPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // === API CONFIGS ===
  const stepsListConfig = {
    config: {
      endpoints: {
        getList: "http://localhost:4000/steps",
        addEP: "http://localhost:4000/steps/add",
        deleteEP: "http://localhost:4000/steps/delete",
        changeOrderEP: "http://localhost:4000/steps/changeIndex"
      },
    },
    syncFunc: setSelectedId
  };

  const runStepConfig = {
    config: {
      host: "http://localhost:4000",
      endpoint: "steps/runStep"
    }
  };

  const modelConfig = {
    config: {
      host: "http://localhost:4000",
      endpoint: "steps/model"
    }
  };

  const charactFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/charact",
        post: "steps/charact"
      }
    }
  };

  const stopFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/stopcond",
        post: "steps/stopcond"
      }
    }
  };

  const localParamsFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/param",
        post: "steps/param"
      },
      stepId: selectedId || ""
    }
  };

  const uploadBtnConfig = {
    config: {
      host: "http://localhost:4000",
      endpoint: "addFiles"
    }
  };

  // === RENDER ===
  return (
    <GridLayout
      outerStyles={styles["optimization"]}
      height="100%"
      width="100%"
      columnWidths={[1, "auto", 2]}
      rowHeights={[1, 1.4]}
      gridItemsAdditionalStyles={[
        styles["optimization__grid-item"],
        styles["optimization__grid-item"],
        null,
        styles["optimization__grid-item"]
      ]}
    >
      <ISL
        {...stepsListConfig}
        height="100%"
        width="auto"
        outerStyles={styles["optimization__steps"]}
      />

      <div className={styles["optimization__btnsList"]}>
        <AddButton />
        <DeleteButton />
        <MoveUpButton />
        <MoveDownButton />
        <RunStepButton stepId={selectedId || ""} {...runStepConfig} />
        <ModelButton {...modelConfig} />
        <UploadDataBtn {...uploadBtnConfig} />
      </div>

      <PageCrowler
        outerStyles={styles["optimization__crowler"]}
        height="100%"
        width="100%"
        pages={{
          "Характеристики": selectedId ? (
            <StepsCharactForm
              {...charactFormConfig}
              stepId={selectedId}
              height="100%"
              width="100%"
              outerStyles={styles["optimization__charact"]}
            />
          ) : (
            <CenteredContainer width="100%" height="100%">
              Выберите шаг
            </CenteredContainer>
          ),
          "Условия остановки": selectedId ? (
            <StopForm
              {...stopFormConfig}
              stepId={selectedId}
              height="100%"
              width="100%"
            />
          ) : (
            <CenteredContainer width="100%" height="100%">
              Выберите шаг
            </CenteredContainer>
          ),
          "Локальные параметры": selectedId ? (
            <ParamsForm
              variant="local"
              config={localParamsFormConfig.config}
              height="100%"
              width="100%"
              outerStyles={styles["optimization__local-params"]}
            />
          ) : (
            <CenteredContainer width="100%" height="100%">
              Выберите шаг
            </CenteredContainer>
          ),
        }}
      />

      <CPlot height="100%" width="100%" />
    </GridLayout>
  );
};
