import { z } from "zod";
import { FormType, settingsPropps } from "./widgets/Settings/api";

export function mainPageReducer(state:pageState, action: actionsT):pageState{
    console.log("Вызвали редюсер")
    switch(action.type){
        case "togglePopUp":
            return({
                    ...state,
                    isPopUpOpen:!state.isPopUpOpen
                })
        case "patchFieldsets":
            return({
                ...state,
                fieldsets:action.newFieldsets
            })
        case "addFieldsets":
        {
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
            const fieldsets = {} as NonNullable<pageState["fieldsets"]>
            for(const k of Object.keys(state["fieldsets"]) as Array<keyof pageState["fieldsets"]>){
                fieldsets[k] = state["fieldsets"][k].map((cur)=>({...cur}))
            }
            for(const k of Object.keys(action.newFieldsets) as Array<keyof pageState["fieldsets"]>){
                const uniqueObj = action.newFieldsets[k].filter((cur)=>{
                    for(const i of fieldsets[k])if (i.value===cur.value) return false
                    return true
                })
                uniqueObj.forEach((cur)=>fieldsets[k].push(cur))
            }
            console.log(fieldsets)
            return({
                ...state,
                "fieldsets":fieldsets
            })
        }
        default:
            throw Error('Unknown action: ' + action)
    }
}
/* Состояние страницу */
type pageState={
    isPopUpOpen:boolean,
    fieldsets: null | z.infer<typeof chartSettingsDataSchema>,
    graph: string//перенастроить это надо 
}

export const initialState:pageState={
    isPopUpOpen: false,
    fieldsets: null ,
    graph: "No plot"//перенастроить это надо 

}

const chartSettingsDataFieldSchema = z.object({
    value: z.string(),
    checked:z.optional(z.union([z.literal("true"),z.literal("false")]))
})
export const chartSettingsDataSchema = z.record(z.string(), z.array(chartSettingsDataFieldSchema))
/* Состояние страницу */

/*Типизация дествия*/
type actionsT = popUpModificationAction|fieldsetsModificationAction

type popUpModificationAction = actionT & {
    type:"togglePopUp"
}

type fieldsetsModificationAction= actionT & {
    type:"patchFieldsets"|"addFieldsets",
    newFieldsets:settingsPropps["config"]["fieldsets"]
}

type actionT = {
    type:string
}
/*Типизация дествия*/

/*Конверторы типов*/
export function patchFieldsetsFormType(oldData:pageState["fieldsets"], newData:FormType):pageState["fieldsets"]{
  if(!oldData)return null

  const data={} as NonNullable<pageState["fieldsets"]>
  for(const k of Object.keys(oldData) as Array<keyof pageState["fieldsets"]>){
    data[k] = oldData[k]
        .map((cur)=>{
            if (typeof newData[k]==="boolean") return {...cur, checked:`${newData[k]}`}
            else if(newData[k].includes(cur.value)) return {...cur, checked:"true"}
            else return {...cur, checked:"false"}
        })
  }
  return data
}
/*Конверторы типов*/