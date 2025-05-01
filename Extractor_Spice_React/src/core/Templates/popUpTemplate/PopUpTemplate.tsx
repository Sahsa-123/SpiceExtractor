import { popUpTemplateI } from "./api";
import styles from "./PopUpTemplate.module.css"

export const PopUpTemplate:React.FC<popUpTemplateI> = ({children, color})=>{
    const additionalStyles = color ? { backgroundColor: COLORS[color] } : {}; 
    return (<div className={styles.popupTemplate} style={additionalStyles}>
        {children}
    </div>)
}

const COLORS={
    black:"rgba(0, 0, 0, 0.6)"
}