type permitedStyles = "flat-bottom"|"crossBtn"
type styleModificationType = permitedStyles[]


export interface btnProps{
    styleModification?:styleModificationType,
    outerStyles?:string|null,
    
    children?:string|null,
    clickHandler?:(e?:React.MouseEvent<HTMLButtonElement>)=>void,
    type?: "button"|"reset"|"submit",
    disabled?:boolean,
}