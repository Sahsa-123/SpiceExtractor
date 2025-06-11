import { btnProps } from "../../../core/UI";

export function getStyles(acativeRoute:string,route:string ):btnProps["styleModification"]{
    return route===acativeRoute ? ["btn--active", "flat-bottom"] :["flat-bottom"]
}