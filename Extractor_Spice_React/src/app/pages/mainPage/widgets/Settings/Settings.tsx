import { useForm } from "react-hook-form"
import { FormType, settingsPropps } from "./api"
import styles from "./Settings.module.css"
import { useWatchFormState } from "./hooks"
import { createDefaultForm, createFieldsets } from "./utils"


export const Settings: React.FC<settingsPropps>=({config, syncFunc, outerStyles=null})=>{
    const{ register, setValue, watch } = useForm<FormType>({defaultValues:createDefaultForm(config.fieldsets)})
    useWatchFormState(watch, syncFunc)//логирование формы
    const fieldsets = createFieldsets(config, register, setValue)
    return (
    <section className={outerStyles||""}>
        <form className={styles["settings__form"]} id="settings-form">
            {fieldsets}
        </form>
    </section>
    )
}



