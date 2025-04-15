import { Button } from "../../../core/UI/Buttons/Button"
import styles from "./MainPage.module.css"
import { Graph } from "./widgets/Graph/Graph"
import { settingsPropps } from "./widgets/Settings/api"
import { Settings } from "./widgets/Settings/Settings"

export const MainPage = ()=>{
    const data = {
        "chip-number-fieldset": [
            {
                "value": "Kristal_0p6_waf0chip1"
            }
        ],
        "inner-nominal-fieldset": [
            {
                "value": "D06p_W35_L3p5"
            },
            {
                "value": "D09p_W100_L1p7"
            },
            {
                "value": "D16n_W35_L3p5"
            },
            {
                "value": "D19n_W100_L1p7"
            }
        ],
        "electric-fieldset": [
            {
                "value": "soi_dc_idvd"
            },
            {
                "value": "soi_dc_idvg"
            }
        ],
        "temperature-fieldset": [
            {
                "value": "300K"
            }
        ]
    }
    const settingsConfig:settingsPropps={
        config:{
            fieldsets:data,
            btnAcceptAll:{
                clickHandler:()=>console.log("Вы выбрали все"),
                children: "Выбрать все"
            },
            btnRejectAll:{
                clickHandler:()=>console.log("Вы сбросили все"),
                children: "сбросили все"
            }
        },
        syncFunc:()=>console.log("Синхронизация")
    }
    return(
        <main className={styles.main} id="app">
            <Graph/>
            <div>
            <Button>Отправить данные</Button>
            </div>
            <Settings {...settingsConfig}/>
        </main>
    )
}