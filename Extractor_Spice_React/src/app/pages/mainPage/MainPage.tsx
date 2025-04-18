import { Button } from "../../../core/UI/Buttons/Button"
import styles from "./MainPage.module.css"
import { Graph } from "./widgets/Graph/Graph"
import { settingsPropps } from "./widgets/Settings/api"
import { Settings } from "./widgets/Settings/Settings"

export const MainPage = ()=>{
    const data:settingsPropps["config"]["fieldsets"] = {
        "chip-number-fieldset": [
            {
                "value": "Kristal_0p6_waf0chip1",
                "checked": "true"
            }
        ],
        "inner-nominal-fieldset": [
            {
                "value": "D06p_W35_L3p5"
            },
            {
                "value": "D09p_W100_L1p7",
                "checked": "true"
            },
            {
                "value": "D16n_W35_L3p5",
                "checked":"true"
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
                "value": "300K",
                "checked": "true"
            }
        ]
    }
    const settingsConfig:settingsPropps={
        config:{
            fieldsets:data,
            btnAcceptAll:{
                children: "Выбрать все",
                type:"button"
            },
            btnRejectAll:{
                children: "сбросили все",
                type:"button"
            }
        },
        syncFunc:()=>console.log("Синхронизация")
    }
    // const queryData = useQuery({queryKey:["r"], queryFn:()=>chartSettingsGET()})
    // if(queryData.data instanceof Error || !queryData.data?.isSuccessful){
    //     return(
    //         <>Упс</>
    //     )
    // }
    // console.log(queryData.data)
    //return(
    //    {/* // <>
        // Данные получены
        // </>*/})
    return(
        <main className={styles.main} id="app">
            <Graph/>
            <div>
            <Button>Отправить данные</Button>
            </div>
            <Settings outerStyles={styles["settings"]}{...settingsConfig}/>
        </main>
    )
}