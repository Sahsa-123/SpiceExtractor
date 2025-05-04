import { centeredContainerI } from "./api";
import styles from "./CenteredContainer.module.css"

export const  CenteredContainer: React.FC<centeredContainerI> = ({ 
    children, 
    width = "auto",
    height = "auto",
    overflow = "auto",
    padding = "0px",

    flexDirection = "row",
    gap="10px",
}) => {
    const additionalStyles={
        width,
        height,
        overflow,
        padding,
    
        flexDirection,
        gap,
    }
    return (
        <div className={`${styles.container}`} style={additionalStyles}>
            {children}
        </div>
    )
}