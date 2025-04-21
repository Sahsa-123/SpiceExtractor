type permitedStyles = "flat-bottom"
type styleModificationType = permitedStyles[]


export interface btnProps{
    children:string,
    clickHandler?:(e?:React.MouseEvent<HTMLButtonElement>)=>void,
    styleModification?:styleModificationType,
    type?: "button"|"reset"|"submit",
    disabled?:boolean
}