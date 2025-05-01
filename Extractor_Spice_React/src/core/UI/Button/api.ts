type permitedStyles = "flat-bottom"|"crossBtn"
type styleModificationType = permitedStyles[]


export interface btnProps{
    children?:string|null,
    clickHandler?:(e?:React.MouseEvent<HTMLButtonElement>)=>void,
    styleModification?:styleModificationType,
    type?: "button"|"reset"|"submit",
    disabled?:boolean,
    outerStyles?:string|null
}