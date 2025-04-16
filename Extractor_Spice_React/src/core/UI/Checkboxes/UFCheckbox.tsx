import {UFCheckboxI} from "./api"

export const UFCheckbox: React.FC<UFCheckboxI> = ({
    id,
    name,
    value,
    text,
    register,
    registerOptions=null,
    outerStyles=null,
    isChecked=false
    // styleModification
})=>{
    // const BASICCLASS = "btn"
    // const className = classNameConverter(styles, styleModification, BASICCLASS)

    const registerReturn = registerOptions?register(name, registerOptions):register(name)
    return(
        <div className={outerStyles||""}>
            <input type="checkbox" checked={isChecked} value={value} {...registerReturn} id={id}/>
            <label htmlFor={id}>{text}</label>
        </div>
    )
}