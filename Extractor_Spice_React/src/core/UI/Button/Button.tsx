import { classNameConverter } from "../sharedHelpers";
import { btnProps } from "./api";
import styles from "./Button.module.css"


export const Button:React.FC<btnProps> = ({
    clickHandler=null, 
    children=null, 
    styleModification=[], 
    type="button", 
    disabled=false,
    outerStyles = null
    })=>{
    const BASICCLASS = "btn"
    const className = classNameConverter(styles, styleModification, BASICCLASS)+(outerStyles||"")

    const handleClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        if (clickHandler) {
            clickHandler(e); 
        }
    };

    return(
        <button disabled={disabled} type={type} onClick={handleClick} className={className}>
            {children}
        </button>
    )
}