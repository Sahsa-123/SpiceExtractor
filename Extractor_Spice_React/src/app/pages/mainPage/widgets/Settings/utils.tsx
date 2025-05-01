import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { FormType, isNonNullConfig, nonNullConfig, settingsPropps } from "./api"
import { fieldsetI } from "./Components"
import { Fieldset } from "./Components"


export function createFieldsets(
	config: settingsPropps["config"],
	register: UseFormRegister<FormType>,
	setValue: UseFormSetValue<FormType>
): React.ReactElement<typeof Fieldset>[] {
	const fieldsets = []
	if(isNonNullConfig(config)){
		for(const i of Object.keys(config.fieldsets)){
			fieldsets.push(<Fieldset {...createFieldsetConfig(config, i, register, setValue)}/>)
		}
	}
	else fieldsets.push(<fieldset></fieldset>)
	return fieldsets
}

function createFieldsetConfig(
	config: nonNullConfig,
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
): FormType|undefined {
	if(checkboxes){
		const defaultValues: {[index: string]: string[]} = {}
		for(const i of Object.keys(checkboxes)){
			const selected = checkboxes[i]
				.filter((elem) => elem?.checked === "true")
				.map((elem) => elem.value)
			if(selected.length != 0) defaultValues[i] = selected
		}
		return defaultValues	
	}
	return undefined
	
}