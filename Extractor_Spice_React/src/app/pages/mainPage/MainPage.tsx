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
import { PagePopUpWindow, PagePopUpWindowI } from "./widgets/PagePopUpWindow";
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
  const{data, status} = useGetData(["chart-settings"])
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
        console.log(data)
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

    return (
      <main className={styles.main} id="app">
        <Graph outerStyles={styles["main__graph"]} plotData={pageState.fieldsets}/>

        <CenteredContainer>
          <PagePopUpWindow config={PagePopUpWindowConfig}>
            <UpdateDataForm syncFunc={()=>queryClient.invalidateQueries({ queryKey: ["chart-settings"] })}/>
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