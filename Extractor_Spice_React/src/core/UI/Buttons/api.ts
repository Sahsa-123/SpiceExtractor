type permitedStyles = "flat-bottom"
type styleModificationType = permitedStyles[]


export interface btnProps{
    clickHandler?:(e?:React.MouseEvent<HTMLButtonElement>)=>void,
    children:string,
    styleModification?:styleModificationType,
    type?: "button"|"reset"|"submit"
}