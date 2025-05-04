//ЭТО СТРАНИЧНЫЙ ШАБЛОН СО СЦЕНАРИЕМ
import { popUpTemplateI } from "./api";
import styles from "./PopUpTemplate.module.css"

const COLORS={
    black:"rgba(0, 0, 0, 0.6)"
}
export const PopUpTemplate: React.FC<popUpTemplateI> = ({ children, color, isVisible }) => {
    const additionalStyles = color ? { backgroundColor: COLORS[color] } : {}; 
    return (
        <div className={`${styles.popupTemplate} ${isVisible ? styles.visible : ''}`} style={additionalStyles}>
            {children}
        </div>
    )
}