//ЭТО СТРАНИЧНЫЙ ШАБЛОН СО СЦЕНАРИЕМ
import {LayoutTemplateI } from "./api";
import styles from "./LayoutTemplate.module.css"

export const LayoutTemplate: React.FC<LayoutTemplateI> = ({ children }) => {
    const [header, page] = children;

    return (
        <div className={`${styles.layout}`}>
            {header}
            {page}
        </div>
    )
}