import { LoaderI } from "./api"
import styles from "./Loader.module.css"
//ВАЖНО НЕ ЗАБЫВАТЬ ИСПОЛЬЗОВАТЬ СТИЛИ ДЛЯ РОДИТЕЛЯ
export const Loader:React.FC<LoaderI> = ({visible})=>{

    return(
        <div className={`${styles.loaderOverlay} ${visible ? styles.visible : ""}`}>
            <div className={styles.loader}></div>
        </div>
    )
}