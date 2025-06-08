import { AFCI } from "./api";
import styles from "./AFC.module.css"

export const AFC: React.FC<AFCI> = ({ 
    children,
    height = "auto",
    width = "auto",
    padding = "0px"
}) => {
    const additionalStyles=children.slice(1).length===1?{justifyContent:"center"}:undefined
    return (
        <div className={styles["AFC"]} style={{height, width, padding}}>
            {children[0]}
            <div className={styles["AFC__interractive-block"]} style={additionalStyles}>
                {children.slice(1)}
            </div>
        </div>
    )
}