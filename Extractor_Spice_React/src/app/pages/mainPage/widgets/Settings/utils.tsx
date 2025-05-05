/*local dependecies*/
import {SettingsSyncData, settingsPropps } from "./api"
/*local dependecies*/

/*inner modules*/
import { fieldsetI, Fieldset } from "./Components"
/*inner modules*/

/*other*/
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
/*other*/

export function createFieldsets(
	config: settingsPropps["config"],
	register: UseFormRegister<SettingsSyncData>,
	setValue: UseFormSetValue<SettingsSyncData>
): React.ReactElement<typeof Fieldset>[] {
	const fieldsets = []
	if(isNonNullConfig(config)){
		for(const i of Object.keys(config.fieldsets)){
			fieldsets.push(<Fieldset key={i} {...createFieldsetConfig(config, i, register, setValue)}/>)
		}
	}
	else fieldsets.push(<fieldset key={"empty"}></fieldset>)
	return fieldsets
}

type nonNullConfig = Omit<settingsPropps["config"], "fieldsets"> & {
    fieldsets: NonNullable<settingsPropps["config"]["fieldsets"]>;
};

function isNonNullConfig(config: settingsPropps["config"]):config is nonNullConfig{
    if(config.fieldsets)return true
    return false
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
				setValue(fieldsetName, false)
			}
		}
	}
}
//======================================================================
export function createDefaultForm(
    checkboxes: settingsPropps["config"]["fieldsets"]
):SettingsSyncData|undefined {
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
