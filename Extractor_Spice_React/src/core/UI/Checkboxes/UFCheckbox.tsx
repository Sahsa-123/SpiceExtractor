import {UFCheckboxI} from "./api"

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
        <div className={outerStyles||""}>
            <input type="checkbox" value={value} {...registerReturn} id={id}/>
            <label htmlFor={id}>{text}</label>
        </div>
    )
}