import { useEffect } from "react"
import { FieldValues, UseFormWatch } from "react-hook-form"
import { FormType } from "./api"

export function useWatchFormState(
        watch:UseFormWatch<FormType>,
        actionFunction: (v:FieldValues)=>void
    ):void{
        useEffect(() => {
            const { unsubscribe } = watch((value) => {
                actionFunction(value)
            })
            return () => unsubscribe()
        }, [watch, actionFunction])
}