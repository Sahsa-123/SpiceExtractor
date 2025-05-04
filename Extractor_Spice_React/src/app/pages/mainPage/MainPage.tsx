/*core dependencies*/
import { Button } from "../../../core/UI";
import { CenteredContainer, PopUpTemplate } from "../../../core/Wrappers";
/*core dependencies*/

/*local dependecies*/
import styles from "./MainPage.module.css";
import { chartSettingsDataSchema, patchFieldsetsFormType} from "./state";
import { useMainPage } from "./hooks";
/*local dependecies*/

/*inner modules*/
import { Graph } from "./widgets/Graph/Graph";
import { Settings } from "./widgets/Settings/Settings";
import { FormType,settingsPropps } from "./widgets/Settings/api";
import { PopUpWindow } from "./widgets/PopUpWindow/PopUpWindow";
import { popUpWindowI } from "./widgets/PopUpWindow/api";
import { useQueryClient } from "@tanstack/react-query";
/*inner modules*/

export const MainPage = () => {
  const {pageState, status, dispatch} = useMainPage()
  const queryClient = useQueryClient();

  if (status === "error") return <div>Ошибка</div>;
  if (status === "pending") return <div>Загрузка...</div>;
  else{
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
        console.log(data)
        const newData = patchFieldsetsFormType(pageState.fieldsets, data)
        console.log(JSON.stringify(newData))
        const parsedData = chartSettingsDataSchema.safeParse(newData)
        console.log(parsedData.error)
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
        close:()=>dispatch({type:"togglePopUp"}),
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
};