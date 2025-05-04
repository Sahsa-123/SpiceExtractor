import {UFCheckboxI} from "./api"
import styles from "./Checkbox.module.css"

export const UFCheckbox: React.FC<UFCheckboxI> = ({
    id,
    name,
    value,
    text,
    register,
    registerOptions=null,
    outerStyles=null,
})=>{
    // добавить аналогичную Button.tsx поддержку стилей

    const registerReturn = registerOptions?register(name, registerOptions):register(name)
    return(
        <div className={`${styles.checkbox} ${outerStyles||""}`}>
            <input type="checkbox" value={value} {...registerReturn} id={id}/>
            <label className={styles.label} htmlFor={id}>{text}</label>
        </div>
    )
}