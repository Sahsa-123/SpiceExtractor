import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { FormType, settingsPropps } from "./api"
import { fieldsetI } from "./Components/api"
import { Fieldset } from "./Components/Fieldset"


export function createFieldsets(
	config: settingsPropps["config"],
	register: UseFormRegister<FormType>,
	setValue: UseFormSetValue<FormType>
): React.ReactElement<typeof Fieldset>[] {
	const fieldsets = []
	for(const i of Object.keys(config.fieldsets)){
		fieldsets.push(<Fieldset {...createFieldsetConfig(config, i, register, setValue)}/>)
	}
	return fieldsets
}

function createFieldsetConfig(
	config: settingsPropps["config"],
	fieldsetName: string,
	register: UseFormRegister<FieldValues>,
	setValue: UseFormSetValue<FieldValues>
): fieldsetI {
	return {
		checkboxes: config.fieldsets[fieldsetName]
			.map((elem, index) => ({
				id: `${fieldsetName}-${index}`,
				outerKey: `${fieldsetName}-${index}`,
				name: fieldsetName,
				value: elem.value,
				text: elem.value,
				register: register,
			})),
		leftBtnProps: {
			...config.btnAcceptAll,
			clickHandler: () => {
				setValue(fieldsetName, config.fieldsets[fieldsetName].map((elem) => elem.value))
			}
		},
		rightBtnProps: {
			...config.btnRejectAll,
			clickHandler: () => {
				setValue(fieldsetName, [])
			}
		}
	}
}

export function createDefaultForm(
    checkboxes: settingsPropps["config"]["fieldsets"]
): FormType {
	const defaultValues: {[index: string]: string[]} = {}
	for(const i of Object.keys(checkboxes)){
		const selected = checkboxes[i]
			.filter((elem) => elem?.checked === "true")
			.map((elem) => elem.value)
		if(selected.length != 0) defaultValues[i] = selected
	}
	return defaultValues
}