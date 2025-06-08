/*core dependencies*/
import { CenteredContainer} from "../../../core/Wrappers";
/*core dependencies*/

/*local dependecies*/
import styles from "./StatsPage.module.css";
import { SettingsSyncToPatch,  initialState, mainPageReducer } from "./state";
import { useGetData } from "./hooks";
/*local dependecies*/

/*inner modules*/
import { Graph } from "./widgets/Graph";
import { Settings, SettingsSyncData, settingsPropps} from "./widgets/Settings";
import { PagePopUpWindow, PagePopUpWindowI } from "../../../core/widgets/PagePopUpWindow";
import { UpdateDataForm } from "./widgets/UpdateDataForm";
/*inner modules*/

/*other*/
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useReducer } from "react";
import { Loader } from "../../../core/UI/Loader";
/*other*/

export const StatsPage = () => {
  /*state*/
  const [pageState, dispatch] = useReducer(mainPageReducer,initialState);
  /*state*/
  
  /* data fetching */
  const{data, status} = useGetData(["chart-settings"], "http://127.0.0.1:8010", "all_params")
  useEffect(() => {
    if(status==="success"){
      dispatch({
      type: "addFieldsets",
      newFieldsets: data
    });
    }
  }, [data, status]);
  /* data fetching */

  const queryClient = useQueryClient();

  if(status === "success"){
    const settingsConfig: settingsPropps = {
      config: {
        fieldsets: pageState.fieldsets,
        btnAcceptAll: {
          children: "Выбрать все",
          type: "button",
        },
        btnRejectAll: {
          children: "Сбросить все",
          type: "button",
        },
      },
      syncFunc: (data:SettingsSyncData) => {
        dispatch({
            type:"patchFieldsets",
            newFieldsets:SettingsSyncToPatch(data)
        })
      },
    };

    const PagePopUpWindowConfig:PagePopUpWindowI["config"] = {
        openBtn:{
          children:"Отправить измерения"
        },
        closeBtn:{
          children:"",
          styleModification:["crossBtn"]
        }
    }

    const udateDataFormConfig={
      syncFunc:()=>queryClient.invalidateQueries({ queryKey: ["chart-settings"] }),
      webConfig:{
        host:"http://127.0.0.1:8010",
        endpoint:"upload-zip"
      }
    }

    const graphConfig={
      plotData:pageState.fieldsets,
      webConfig:{
        host:"http://127.0.0.1:8010",
        endpoint:"plots"
      }
    }
    return (
      <main className={styles.main} id="app">
        <Graph outerStyles={styles["main__graph"]} {...graphConfig}/>

        <CenteredContainer>
          <PagePopUpWindow config={PagePopUpWindowConfig}>
            <UpdateDataForm {...udateDataFormConfig}/>
          </PagePopUpWindow>
        </CenteredContainer>

        <Settings outerStyles={styles["main__settings"]} {...settingsConfig} />
      </main>
    );
  }
  else if (status === "pending") {
    return (
      <main className={styles.main}>
        <div className={styles["main__loader-container"]}>
          <Loader visible={true}/>
        </div>
      </main>
    );
  } else {
    return (
      <main className={`${styles["main"]} ${styles["main--on-error"]}`}>
        <CenteredContainer width="100%" height="100%" flexDirection="column">
          <span>Ошибка загрузки</span>
          <span>Проверьте интернет-соединение или повторите попытку позже.</span>
        </CenteredContainer>
      </main>
    );
  }

};