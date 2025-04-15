import { ReactNode } from "react"
import styles from "./Container.module.css"

interface ContainerProps {
    children: ReactNode | ReactNode[];
  }

export const Container: React.FC<ContainerProps> = ({children})=>{
    return(
        <div className={styles.container}>
            {children}
        </div>
    )
}