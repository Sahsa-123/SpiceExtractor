import { AFCI } from "./api";
import styles from "./AFC.module.css"

export const AFC: React.FC<AFCI> = ({ 
    children,
    height = "auto",
    width = "auto"
}) => {
    return (
        <div className={styles["AFC"]} style={{height, width}}>
            {children[0]}
            <div className={styles["AFC__interractive-block"]}>
                {children.slice(1)}
            </div>
        </div>
    )
}