/*local dependencies*/
import { SettingsSyncData } from "./api"
/*local dependencies*/

/*other*/
import { useEffect } from "react"
import { FieldValues, UseFormWatch } from "react-hook-form"
/*other*/
export function useWatchFormState(
        watch:UseFormWatch<SettingsSyncData>,
        actionFunction: (v:FieldValues)=>void
    ):void{
        useEffect(() => {
            const { unsubscribe } = watch((value) => {
                console.log(value)
                actionFunction(value)
            })
            return () => unsubscribe()
        }, [watch, actionFunction])
}