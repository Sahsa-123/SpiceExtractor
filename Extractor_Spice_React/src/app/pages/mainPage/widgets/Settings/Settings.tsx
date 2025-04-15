import { FieldValues, SubmitHandler, useForm, UseFormGetValues, UseFormRegister } from "react-hook-form"
import { Container } from "../../../../../core/templates/Container/Container"
import { settingsPropps } from "./api"
import styles from "./Settings.module.css"
import { Fieldset } from "./Components/Fieldset"
import { fieldsetI } from "./Components/api"
import { useEffect } from "react"

export const Settings: React.FC<settingsPropps>=({config,syncFunc, outerStyles=null})=>{
    const{ register, handleSubmit, watch } = useForm()
    const fieldsets = []
    for(const i of (Object.keys(config.fieldsets))){
        fieldsets.push(<Fieldset {...createFieldsetConfig(config, i, register)}/>)
    }

    const formState = watch();
    useEffect(()=>{
        console.log(formState)
    },[formState])
    const onSubmit = (data) => console.log(data)
    
    return (
    <section className={outerStyles||""}>
        <form onSubmit={()=>handleSubmit(onSubmit)} className={styles["settings__form"]} id="settings-form">
            {fieldsets}
          </form>
    </section>
    )
}

function createFieldsetConfig(
    config:settingsPropps["config"],
    fieldsetName:keyof settingsPropps,
    register:UseFormRegister<FieldValues>
    ):fieldsetI {
    return {
        checkboxes:config.fieldsets[fieldsetName]
        .map((elem, index) => ({
            id: `${fieldsetName}-${index}`,
            name: fieldsetName,
            value: elem.value,
            text: elem.value,
            register: register,
            })
        ),
        leftBtnProps:config.btnAcceptAll,
        rightBtnProps: config.btnRejectAll
    }
}

