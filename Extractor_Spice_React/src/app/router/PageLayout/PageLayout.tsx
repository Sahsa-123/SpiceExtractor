import {PageLayoutI } from "./api";
import styles from "./PageLayout.module.css"

export const PageLayout: React.FC<PageLayoutI> = ({ children }) => {
    const [header, page] = children;

    return (
        <div className={`${styles.layout}`}>
            {header}
            {page}
        </div>
    )
}