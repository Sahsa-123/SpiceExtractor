/*core dependencies*/
import { CenteredContainer} from "../../../core/Wrappers";
/*core dependencies*/

/*local dependecies*/
import styles from "./MainPage.module.css";
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
/*other*/

export const MainPage = () => {
  /*state*/
  const [pageState, dispatch] = useReducer(mainPageReducer,initialState);
  /*state*/
  
  /* data fetching */
  const{data, status} = useGetData(["chart-settings"], "http://127.0.0.1:8010", "all_params")
  useEffect(() => {
    dispatch({
      type: "addFieldsets",
      newFieldsets: data
    });
  }, [data]);
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
      config:{
        host:"http://127.0.0.1:8010",
        endpoint:"upload-zip"
      }
    }

    const graphConfig={
      plotData:pageState.fieldsets,
      config:{
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
  else{
    return(
      <CenteredContainer width="100%" height="100%">
        {status==="pending"?"Loading...":"Error loading data"}
      </CenteredContainer>
    )
  }
};