// import React, { useState } from 'react';
// import { AFC, CenteredContainer } from "../../../core/Wrappers";

// /* Widgets */
// import {
//   ISL,
//   AddButton,
//   DeleteButton,
//   MoveUpButton,
//   MoveDownButton,
// } from "./widgets/InteractiveServerList";
// import {
//   RunStepButton,
//   ModelButton,
//   CPlot,
// } from "./widgets/ControlledPlot";
// import { UploadDataBtn } from "./widgets/ControlledPlot/PlotControllers/Upload";
// import { PageCrowler } from './widgets/PageCrowler';
// import {
//   StepsCharactForm
// } from './widgets/Forms';

// import {  StopForm} from "./widgets/InterractiveServerForm/Forms/StopForm/StopForm"
// import { ParamsForm } from './widgets/ParamsForm';
// import { GridLayout } from './GridLayout';

// /* Styles */
// import styles from "./OptimizationPage.module.css";
// import { ISF } from './widgets/InterractiveServerForm/ISF';
// import { SubmitButton } from './widgets/InterractiveServerForm/SubmitFile';
// import { StopFormValues, StopSchema } from './widgets/InterractiveServerForm/Forms/StopForm/schema';

// export const OptimizationPage: React.FC = () => {
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   // === API CONFIGS ===
//   const stepsListConfig = {
//     config: {
//       endpoints: {
//         getList: "http://localhost:4000/steps",
//         addEP: "http://localhost:4000/steps/add",
//         deleteEP: "http://localhost:4000/steps/delete",
//         changeOrderEP: "http://localhost:4000/steps/changeIndex"
//       },
//     },
//     syncFunc: setSelectedId
//   };

//   const runStepConfig = {
//     config: {
//       host: "http://localhost:4000",
//       endpoint: "steps/runStep"
//     }
//   };

//   const modelConfig = {
//     config: {
//       host: "http://localhost:4000",
//       endpoint: "steps/model"
//     }
//   };

//   const charactFormConfig = {
//     config: {
//       host: "http://localhost:4000",
//       endpoints: {
//         get: "steps/charact",
//         post: "steps/charact"
//       }
//     }
//   };

//   // const stopFormConfig = {
//   //   config: {
//   //     host: "http://localhost:4000",
//   //     endpoints: {
//   //       get: "steps/stopcond",
//   //       post: "steps/stopcond"
//   //     }
//   //   }
//   // };

//   const localParamsFormConfig = {
//     config: {
//       host: "http://localhost:4000",
//       endpoints: {
//         get: "steps/param",
//         post: "steps/param"
//       },
//       stepId: selectedId || ""
//     }
//   };

//   const uploadBtnConfig = {
//     config: {
//       host: "http://localhost:4000",
//       endpoint: "addFiles"
//     }
//   };

//   //===EXPERIMENTAL
// const stopFormConfig = selectedId
//   ? {
//       formName: "stopForm",
//       stepId: selectedId,
//       schema: StopSchema,
//       config: {
//         host: "http://localhost:4000",
//         endpoints: {
//           get: "steps/stopcond",
//           post: "steps/stopcond",
//         },
//       },
//     }
//   : null;


//   // === RENDER ===
//   return (
//     <GridLayout
//       outerStyles={styles["optimization"]}
//       height="100%"
//       width="100%"
//       columnWidths={[1, "auto", 2]}
//       rowHeights={[1, 1.4]}
//       gridItemsAdditionalStyles={[
//         styles["optimization__grid-item"],
//         styles["optimization__grid-item"],
//         null,
//         styles["optimization__grid-item"]
//       ]}
//     >
//       <ISL
//         {...stepsListConfig}
//         height="100%"
//         width="auto"
//         outerStyles={styles["optimization__steps"]}
//       />

//       <div className={styles["optimization__btnsList"]}>
//         <AddButton />
//         <DeleteButton />
//         <MoveUpButton />
//         <MoveDownButton />
//         <RunStepButton stepId={selectedId || ""} {...runStepConfig} />
//         <ModelButton {...modelConfig} />
//         <UploadDataBtn {...uploadBtnConfig} />
//       </div>

//       <PageCrowler
//         outerStyles={styles["optimization__crowler"]}
//         height="100%"
//         width="100%"
//         pages={{
//           "Характеристики": selectedId ? (
//             <StepsCharactForm
//               {...charactFormConfig}
//               stepId={selectedId}
//               height="100%"
//               width="100%"
//               outerStyles={styles["optimization__charact"]}
//             />
//           ) : (
//             <CenteredContainer width="100%" height="100%">
//               Выберите шаг
//             </CenteredContainer>
//           ),
//           "Условия остановки": selectedId && stopFormConfig ? (
//             <ISF<StopFormValues> {...stopFormConfig}>
//               <AFC height='100%' width='100%'>
//                 <StopForm
//                   height="auto"
//                   width="auto"
//                   outerStyles={styles["optimization__local-params"]}
//                 />
//               <SubmitButton />
//               </AFC>
//             </ISF>
//           ) : (
//             <CenteredContainer width="100%" height="100%">
//               Выберите шаг
//             </CenteredContainer>
//           ),
//           "Локальные параметры": selectedId ? (
//             <ParamsForm
//               variant="local"
//               config={localParamsFormConfig.config}
//               height="100%"
//               width="100%"
//               outerStyles={styles["optimization__local-params"]}
//             />
//           ) : (
//             <CenteredContainer width="100%" height="100%">
//               Выберите шаг
//             </CenteredContainer>
//           ),
//         }}
//       />

//       <CPlot height="100%" width="100%" />
//     </GridLayout>
//   );
// };
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
import { UploadDataBtn } from "./widgets/ControlledPlot/PlotControllers/Upload";
import { PageCrowler } from "./widgets/PageCrowler";
import { StopForm, StepsCharactForm } from "./widgets/InterractiveServerForm/Forms";
import { ParamsForm } from "./widgets/ParamsForm";
import { GridLayout } from "./GridLayout";

/* Styles */
import styles from "./OptimizationPage.module.css";

/* ISF */
import { ISF } from "./widgets/InterractiveServerForm/ISF";
import { SubmitButton } from "./widgets/InterractiveServerForm/SubmitFile";

/* StopForm schema + context */
import { StopFormValues, StopSchema } from "./widgets/InterractiveServerForm/Forms";
import { StopFormContext } from "./widgets/InterractiveServerForm/Forms";

/* CharactForm schema + context */
import { StepsCharactSchema, StepsCharactSchemaType } from "./widgets/InterractiveServerForm/Forms";
import { StepsCharactFormContext } from "./widgets/InterractiveServerForm/Forms";

export const OptimizationPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // === CONFIGS ===
  const stepsListConfig = {
    config: {
      endpoints: {
        getList: "http://localhost:4000/steps",
        addEP: "http://localhost:4000/steps/add",
        deleteEP: "http://localhost:4000/steps/delete",
        changeOrderEP: "http://localhost:4000/steps/changeIndex",
      },
    },
    syncFunc: setSelectedId,
  };

  const runStepConfig = {
    config: {
      host: "http://localhost:4000",
      endpoint: "steps/runStep",
    },
  };

  const modelConfig = {
    config: {
      host: "http://localhost:4000",
      endpoint: "steps/model",
    },
  };

  const uploadBtnConfig = {
    config: {
      host: "http://localhost:4000",
      endpoint: "addFiles",
    },
  };

  const stopFormConfig = selectedId
    ? {
        formName: "stopForm",
        stepId: selectedId,
        schema: StopSchema,
        context: StopFormContext,
        config: {
          host: "http://localhost:4000",
          endpoints: {
            get: "steps/stopcond",
            post: "steps/stopcond",
          },
        },
      }
    : null;

  const charactFormConfig = selectedId
    ? {
        formName: "charactForm",
        stepId: selectedId,
        schema: StepsCharactSchema,
        context: StepsCharactFormContext,
        config: {
          host: "http://localhost:4000",
          endpoints: {
            get: "steps/charact",
            post: "steps/charact",
          },
        },
      }
    : null;

  const localParamsFormConfig = {
    config: {
      host: "http://localhost:4000",
      endpoints: {
        get: "steps/param",
        post: "steps/param",
      },
      stepId: selectedId || "",
    },
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
        <RunStepButton stepId={selectedId || ""} {...runStepConfig} />
        <ModelButton {...modelConfig} />
        <UploadDataBtn {...uploadBtnConfig} />
      </div>

      <PageCrowler
        outerStyles={styles["optimization__crowler"]}
        height="100%"
        width="100%"
        pages={{
          "Характеристики": charactFormConfig ? (
            <ISF<StepsCharactSchemaType> {...charactFormConfig}>
              <AFC height="100%" width="100%">
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
              <AFC height="100%" width="100%">
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
