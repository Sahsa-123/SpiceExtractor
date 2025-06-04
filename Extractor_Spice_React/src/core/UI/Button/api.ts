type permitedStyles = "flat-bottom"|"crossBtn"|"btn--white_n_blue"|"btn--active"
type styleModificationType = permitedStyles[]


export interface btnProps{
    styleModification?:styleModificationType,
    outerStyles?:string|null,
    
    children?:string|null,
    clickHandler?:(e?:React.MouseEvent<HTMLButtonElement>)=>void,
    type?: "button"|"reset"|"submit",
    disabled?:boolean,
}