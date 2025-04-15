import {UFCheckboxI} from "./api"
import styles from "./Checkbox.module.css"

export const UFCheckbox: React.FC<UFCheckboxI> = ({
    id,
    name,
    registerOptions=null,
    value,
    text,
    register,
    // styleModification
})=>{
    // const BASICCLASS = "btn"
    // const className = classNameConverter(styles, styleModification, BASICCLASS)

    const registerReturn = registerOptions?register(name, registerOptions):register(name)
    return(
        <div className={styles["fieldset__input-block"]}>
            <input type="checkbox" value={value} {...registerReturn} id={id}/>
            <label htmlFor={id}>{text}</label>
        </div>
    )
}