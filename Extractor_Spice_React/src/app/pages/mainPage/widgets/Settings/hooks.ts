import { useEffect } from "react"
import { FieldValues, UseFormWatch } from "react-hook-form"

export function useWatchFormState(
    watch:UseFormWatch<FieldValues>,
    actionFunction: (v:FieldValues)=>void
):void{
    useEffect(() => {
            const { unsubscribe } = watch((value) => {
                actionFunction(value)
            })
            return () => unsubscribe()
        }, [watch, actionFunction])
}