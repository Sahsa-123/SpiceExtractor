import {PageCenteredContainerI } from "./api";
import styles from "./PageCenteredContainer.module.css"

export const  PageCenteredContainer: React.FC<PageCenteredContainerI> = ({ 
    children,
    width = "1870px",
    padding = "0px 25px"
}) => {
    const additionalStyles={
        width,
        padding,
    }
    return (
        <div className={`${styles.container}`} style={additionalStyles}>
            {children}
        </div>
    )
}