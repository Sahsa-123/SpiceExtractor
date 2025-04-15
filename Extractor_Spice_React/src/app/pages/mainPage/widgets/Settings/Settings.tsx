import { FieldValues, useForm, UseFormRegister } from "react-hook-form"
import { Container } from "../../../../../core/templates/Container/Container"
import { settingsPropps } from "./api"
import styles from "./Settings.module.css"
import { Fieldset } from "./Components/Fieldset"
import { fieldsetI } from "./Components/api"

export const Settings: React.FC<settingsPropps>=({config,syncFunc})=>{
    const{ register } = useForm()
    const fieldsets = []
    for(const i of (Object.keys(config.fieldsets) as Array<keyof typeof config.fieldsets>)){
        fieldsets.push(<Fieldset {...createFieldsetConfig(config, i, register)}/>)
    }
    return (
    <section className={styles["settings"]}>
        <Container>
        <form className={styles["settings__form"]} id="settings-form">
            {fieldsets}
          </form>
        </Container>
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

