import { Button } from "../../../core/UI";
import styles from "./MainPage.module.css";
import { Graph } from "./widgets/Graph/Graph";
import { Settings } from "./widgets/Settings/Settings";
import { FormType,settingsPropps } from "./widgets/Settings/api";
import { PopUpWindow } from "./widgets/PopUpWindow/PopUpWindow";
import { PopUpTemplate } from "../../../core/Templates";
import { useMainPage } from "./hooks";
import { patchFieldsetsFormType } from "./state";
import { popUpWindowI } from "./widgets/PopUpWindow/api";
import { chartSettingsDataSchema } from "./state";

export const MainPage = () => {
  const {pageState, status, dispatch} = useMainPage()

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
        updateData: ()=>console.log("Обновили данные")
      }
    }

    return (
      <main className={styles.main} id="app">
        <Graph plotData={pageState.fieldsets}/>
        <div>
          <Button type="button" clickHandler={()=>dispatch({type:"togglePopUp"})}>Отправить данные</Button>
          {/* {!pageState.isPopUpOpen||
          <PopUpTemplate color="black">
            <PopUpWindow {...popUpWindowConfig}/>
          </PopUpTemplate>} */}
          <PopUpTemplate color="black" isVisible={pageState.isPopUpOpen}>
            <PopUpWindow {...popUpWindowConfig}/>
          </PopUpTemplate>
        </div>
        <Settings outerStyles={styles.settings} {...settingsConfig} />
      </main>
    );
  }
};