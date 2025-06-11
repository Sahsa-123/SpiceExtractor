/*inner modules*/
import type { SettingsSyncData } from "./widgets/Settings"
/*inner modules*/

/*other*/
import { z } from "zod";
/*other*/

export{ mainPageReducer, initialState, fieldsetSchema, type FieldsetsType}

function mainPageReducer(state:pageState, action: actionsT):pageState{
    switch(action.type){
        case "patchFieldsets":{
                return({
                ...state,
                fieldsets: patchFieldsets(state.fieldsets, action.newFieldsets)
                })
            }
        case "addFieldsets":{
                if(!action.newFieldsets || !state){
                    return{
                        ...state
                    }
                }
                if(!state["fieldsets"]){
                    return{
                        ...state,
                        fieldsets:action.newFieldsets
                    }
                }
                const data = addFieldsets(state["fieldsets"], action.newFieldsets)
                return({
                    ...state,
                    "fieldsets":data
                })
            }
        default:
            throw Error('Unknown action: ' + action)
    }
}

function patchFieldsets(
    oldData:pageState["fieldsets"], 
    selectedData:pageState["fieldsets"]
):pageState["fieldsets"]{
    console.log(selectedData)
    if(!oldData) return oldData
    if(!selectedData) return oldData

    const data={} as NonNullable<pageState["fieldsets"]>
    for(const k of Object.keys(oldData) as Array<keyof pageState["fieldsets"]>){
        data[k] = oldData[k].map((cur)=>{
                if (k in selectedData){
                    for(const i of selectedData[k]){
                        if(i.value===cur.value)return i
                    }
                    return{
                        ...cur,
                        checked:"false"
                    }
                }
                else{
                    return {
                        ...cur,
                        checked:"false"
                    }
                }
            })
    }
    return data
}

function addFieldsets(
    oldFieldsets:NonNullable<pageState["fieldsets"]>, 
    newFieldsets:NonNullable<pageState["fieldsets"]>
):pageState["fieldsets"]{
    const fieldsets = {} as NonNullable<pageState["fieldsets"]>
    for(const k of Object.keys(oldFieldsets) as Array<keyof pageState["fieldsets"]>){
        fieldsets[k] = oldFieldsets[k].map((cur)=>({...cur}))
    }
    for(const k of Object.keys(newFieldsets) as Array<keyof pageState["fieldsets"]>){
        const uniqueObj = newFieldsets[k].filter((cur)=>{
            for(const i of fieldsets[k])if (i.value===cur.value) return false
            return true
        })
        uniqueObj.forEach((cur)=>fieldsets[k].push(cur))
    }
    return fieldsets
}
/* Состояние страницы */
type pageState={
    fieldsets: FieldsetsType,
}

type FieldsetsType = null | z.infer<typeof fieldsetSchema>

const initialState:pageState={
    fieldsets: null,
}

const fieldsetSchema = z.record(
    z.string(), 
    z.array(
        z.object({
            value: z.string(),
            checked:z.optional(z.union([z.literal("true"),z.literal("false")]))
        })
    )
)
/* Состояние страницы */

/*Конверторы типов*/
export function SettingsSyncToPatch(data:SettingsSyncData):pageState["fieldsets"]{
    const converted={} as NonNullable<pageState["fieldsets"]>
    for(const k of Object.keys(data) as Array<keyof pageState["fieldsets"]>){
        if(typeof data[k]==="string"){
            converted[k] = [{value:data[k],checked:"true"}] 
        }
        else if (typeof data[k] !=="boolean"){
            converted[k] = data[k]
            .map((cur)=>({value: cur, checked:"true"}))
        }
  }
  return converted
}
/*Конверторы типов*/

/*Типизация дествия*/
type actionsT = fieldsetsModificationAction

type fieldsetsModificationAction= actionT & {
    type:"patchFieldsets"|"addFieldsets",
    newFieldsets:pageState["fieldsets"]
}

type actionT = {
    type:string
}
/*Типизация дествия*/