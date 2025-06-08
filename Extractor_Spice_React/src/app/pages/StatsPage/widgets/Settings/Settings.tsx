/*local dependencies*/
import {SettingsSyncData, settingsPropps } from "./api"
import styles from "./Settings.module.css"
import { useWatchFormState } from "./hooks"
import { createDefaultForm, createFieldsets } from "./utils"
/*local dependencies*/

/*other*/
import { useForm } from "react-hook-form"
/*other*/

export const Settings: React.FC<settingsPropps>=({config, syncFunc, outerStyles=null})=>{
    const{ register, setValue, watch } = useForm<SettingsSyncData>({defaultValues:createDefaultForm(config.fieldsets)})
    
    useWatchFormState(watch, syncFunc)
    return (
    <section className={`${outerStyles||""} ${styles["wrapper"]}`}>
        <form className={styles["settings__form"]} id="settings-form">
            {createFieldsets(config, register, setValue, "Загрузите измерения")}
        </form>
    </section>
    )
}


