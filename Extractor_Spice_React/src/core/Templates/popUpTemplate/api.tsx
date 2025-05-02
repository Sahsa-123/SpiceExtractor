export interface popUpTemplateI{
    color?:undefined|permitedColors,
    children: React.ReactElement,
    isVisible:boolean
}

type permitedColors = "black"