/*core dependencies*/
import { Button } from "../../../core/UI";
import { CenteredContainer, PopUpTemplate } from "../../../core/Wrappers";
/*core dependencies*/

/*local dependecies*/
import styles from "./MainPage.module.css";
import { fieldsetSchema, patchFieldsetsFormType} from "./state";
import { useGetData } from "./hooks";
/*local dependecies*/

/*inner modules*/
import { Graph } from "./widgets/Graph/Graph";
import { Settings } from "./widgets/Settings/Settings";
import { FormType,settingsPropps } from "./widgets/Settings/api";
import { PopUpWindow } from "./widgets/PopUpWindow/PopUpWindow";
import { popUpWindowI } from "./widgets/PopUpWindow/api";
import { useQueryClient } from "@tanstack/react-query";
/*inner modules*/

/*added */
import { useEffect, useReducer } from "react";
import { initialState, mainPageReducer } from "./state";
/*added */

export const MainPage = () => {
  /*state*/
  const [pageState, dispatch] = useReducer(mainPageReducer,initialState);
  /*state*/
  
  const{data, status} = useGetData(["chart-settings"])
  useEffect(() => {
    dispatch({
      type: "patchFieldsets",
      newFieldsets: data
    });
  }, [data]);
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
      syncFunc: (data:FormType) => {
        const newData = patchFieldsetsFormType(pageState.fieldsets, data)
        const parsedData = fieldsetSchema.safeParse(newData)
        if(parsedData.success){
          dispatch({
            type:"patchFieldsets",
            newFieldsets:parsedData.data
          })
        }
      },
    };

    const popUpWindowConfig:popUpWindowI = {
      syncFuncs:{
        close: ()=>dispatch({type:"togglePopUp"}),
        updateData: ()=>queryClient.invalidateQueries({ queryKey: ["chart-settings"] })
      }
    }

    return (
      <main className={styles.main} id="app">
        <Graph outerStyles={styles["main__graph"]} plotData={pageState.fieldsets}/>

        <CenteredContainer width="100%">
          <Button type="button" clickHandler={()=>dispatch({type:"togglePopUp"})}>Отправить данные</Button>
          <PopUpTemplate color="black" isVisible={pageState.isPopUpOpen}>
            <PopUpWindow {...popUpWindowConfig}/>
          </PopUpTemplate>
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