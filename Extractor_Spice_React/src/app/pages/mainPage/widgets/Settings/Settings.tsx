import { FieldValues, useForm, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { settingsPropps } from "./api"
import styles from "./Settings.module.css"
import { Fieldset } from "./Components/Fieldset"
import { fieldsetI } from "./Components/api"

export const Settings: React.FC<settingsPropps>=({config, syncFunc, outerStyles=null})=>{
    console.log(JSON.stringify(createDefaultForm(config.fieldsets)))
    const{ register, getValues, setValue } = useForm({
        defaultValues:createDefaultForm(config.fieldsets)
    })
    const fieldsets = []
    for(const i of (Object.keys(config.fieldsets))){
        fieldsets.push(<Fieldset {...createFieldsetConfig(config, i, register, setValue)}/>)
    }

    return (
    <section className={outerStyles||""}>
        <form className={styles["settings__form"]} id="settings-form">
            {fieldsets}
            <button type="button" onClick={()=>console.log( setValue("inner-nominal-fieldset"))}>Получить состояние</button>
          </form>
    </section>
    )
}

function createFieldsetConfig(
    config:settingsPropps["config"],
    fieldsetName:keyof settingsPropps,
    register:UseFormRegister<FieldValues>,
    setValue: UseFormSetValue<FieldValues>
    ):fieldsetI {
    return {
        checkboxes:config.fieldsets[fieldsetName]
        .map((elem, index) => ({
            id: `${fieldsetName}-${index}`,
            outerKey: `${fieldsetName}-${index}`,
            name: fieldsetName,
            value: elem.value,
            text: elem.value,
            register: register,
            })
        ),
        leftBtnProps: {
            ...config.btnAcceptAll,
            clickHandler:()=>{
                setValue(fieldsetName, config.fieldsets[fieldsetName].map((elem)=>elem.value))
            }
        },
        rightBtnProps: {
            ...config.btnRejectAll,
            clickHandler:()=>{
                setValue(fieldsetName, [])
            }
        }
    }
}

function createDefaultForm(checkboxes: settingsPropps["config"]["fieldsets"]){
    const defaultValues:{[index: string]:string[]} = {}
    for(const i of Object.keys(checkboxes)){
        const selected = checkboxes[i]
            .filter((elem)=>elem?.checked==="true")
            .map((elem)=>elem.value)
        if(selected.length!=0)defaultValues[i]=selected
    }
    return defaultValues
}


