import React, { useState } from "react";
import { AFC, CenteredContainer } from "../../../core/Wrappers";

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
import { SelectElemBtn } from "./widgets/ControlledPlot/PlotControllers/SelectElem";
import { PageCrowler } from "./widgets/PageCrowler";
import { StopForm, StepsCharactForm, ParamsForm } from "./widgets/InterractiveServerForm/Forms";
import { GridLayout } from "./GridLayout";

/* Styles */
import styles from "./OptPage.module.css";

/* ISF */
import { ISF } from "./widgets/InterractiveServerForm/ISF";
import { SubmitButton } from "./widgets/InterractiveServerForm/SubmitFile";

/* Schemas + Contexts */
import { StopFormValues, StopSchema } from "./widgets/InterractiveServerForm/Forms";
import { StopFormContext } from "./widgets/InterractiveServerForm/Forms";
import { StepsCharactSchema, StepsCharactSchemaType } from "./widgets/InterractiveServerForm/Forms";
import { StepsCharactFormContext } from "./widgets/InterractiveServerForm/Forms";
import { GlobalParamSchema, LocalParamSchema } from "./widgets/InterractiveServerForm/Forms";
import { GlobalParamsFormContext, LocalParamsFormContext } from "./widgets/InterractiveServerForm/Forms";

import { btnProps, Button } from "../../../core/UI";
import { PagePopUpWindow } from "../../../core/widgets";
import { PagePopUpWindowI } from "../../../core/widgets";

export const OptPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const BASE_URL = "http://127.0.0.1:8010";

  const stepsListConfig = {
    config: {
      host: BASE_URL,
      endpoints: {
        getList: "steps",
        addEP: "steps/add",
        deleteEP: "steps/delete",
        changeOrderEP: "steps/change_index",
      },
    },
    syncFunc: setSelectedId,
  };


const runStepConfig = {
  config: {
    host: BASE_URL,
    endpoint: "run_step",
    ...(selectedId && {
      queryParams: { id: selectedId },
    }),
  },
  isDisabled: !selectedId,
};


  const modelConfig = {
    config: {
      host: BASE_URL,
      endpoint: "steps/model",
    },
  };

  const stopFormConfig = selectedId
    ? {
        formName: "stopForm",
        queryParams: { id: selectedId },
        schema: StopSchema,
        context: StopFormContext,
        config: {
          host: BASE_URL,
          endpoints: {
            get: "steps/stopcond",
            post: "steps/stopcond",
          },
        },
        width:"100%" as const,
        height:"100%" as const
      }
    : null;

  const charactFormConfig = selectedId
    ? {
        formName: "charactForm",
        queryParams: { id: selectedId },
        schema: StepsCharactSchema,
        context: StepsCharactFormContext,
        config: {
          host: BASE_URL,
          endpoints: {
            get: "steps/characteristics",
            post: "steps/characteristics",
          },
        },
        width:"100%" as const,
        height:"100%" as const
      }
    : null;

  const localParamsFormConfig = selectedId
    ? {
        formName: "localParams",
        queryParams: { id: selectedId },
        schema: LocalParamSchema,
        context: LocalParamsFormContext,
        config: {
          host: BASE_URL,
          endpoints: {
            get: "steps/params",
            post: "steps/params",
          },
        },
        width:"100%" as const,
        height:"100%" as const
      }
    : null;

  const globalParamPopupConfig: PagePopUpWindowI["config"] = {
    openBtn: {
      children: "Глобальные параметры",
    },
    closeBtn: {
      children: "",
      styleModification: ["crossBtn"] as const,
    },
  };

  const globalParamsISFConfig = {
    formName: "globalParams",
    queryParams: null,
    schema: GlobalParamSchema,
    context: GlobalParamsFormContext,
    config: {
      host: BASE_URL,
      endpoints: {
        get: "ParamTable",
        post: "update_ParamTable",
      },
    },
    width:"auto" as const,
    height:"auto" as const
  };

  const downloadParamTableBtnConfig: btnProps = {
    clickHandler: () => {
      window.open("http://127.0.0.1:8010/download_ParamTable", "_blank");
    },
    styleModification: ["btn--white_n_blue"],
    children: "Скачать",
  };

  const downloadModelBtnConfig = {
    clickHandler: async () => {
      const response = await fetch("http://127.0.0.1:8010/download_model");
      if (!response.ok) {
        alert("Не удалось скачать модель");
        return;
      }
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "model.mod";
      downloadLink.click();
    },
    children: "Скачать модель",
  };

  const cplotUploadBtnConfig = {
    config: {
      host: BASE_URL,
      listEndpoint: "elem_list",
      plotEndpoint: "add_files",
    },
  };

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
        styles["optimization__grid-item"],
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
        <RunStepButton {...runStepConfig} />
        <ModelButton {...modelConfig} />
        <SelectElemBtn {...cplotUploadBtnConfig} />
        <Button {...downloadModelBtnConfig} />
        <PagePopUpWindow config={globalParamPopupConfig}>
          <ISF {...globalParamsISFConfig}>
            <AFC height="600px" width="600px">
              <ParamsForm
                variant="glob"
                height="100%"
                width="100%"
                outerStyles={styles["optimization__local-params"]}
              />
              <SubmitButton context={GlobalParamsFormContext} />
              <Button {...downloadParamTableBtnConfig} />
            </AFC>
          </ISF>
        </PagePopUpWindow>
      </div>

      <PageCrowler
        outerStyles={styles["optimization__crowler"]}
        height="100%"
        width="100%"
        pages={{
          "Характеристики": charactFormConfig ? (
            <ISF<StepsCharactSchemaType> {...charactFormConfig}>
              <AFC padding="1em" height="100%" width="100%">
                <StepsCharactForm
                  height="auto"
                  width="auto"
                  outerStyles={styles["optimization__charact"]}
                />
                <SubmitButton context={StepsCharactFormContext} />
              </AFC>
            </ISF>
          ) : (
            <CenteredContainer width="100%" height="100%">
              Выберите шаг
            </CenteredContainer>
          ),

          "Условия остановки": stopFormConfig ? (
            <ISF<StopFormValues> {...stopFormConfig}>
              <AFC padding="1em" height="100%" width="100%">
                <StopForm
                  height="auto"
                  width="auto"
                  outerStyles={styles["optimization__local-params"]}
                />
                <SubmitButton context={StopFormContext} />
              </AFC>
            </ISF>
          ) : (
            <CenteredContainer width="100%" height="100%">
              Выберите шаг
            </CenteredContainer>
          ),

          "Локальные параметры": localParamsFormConfig ? (
            <ISF {...localParamsFormConfig}>
              <AFC padding="1em" height="100%" width="100%">
                <ParamsForm
                  variant="local"
                  height="100%"
                  width="100%"
                  outerStyles={styles["optimization__local-params"]}
                />
                <SubmitButton context={LocalParamsFormContext} />
              </AFC>
            </ISF>
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
