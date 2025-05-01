import { Outlet } from "react-router"
import { Header } from "./Header"
import styles from "./layout.module.css"


export const BasicLayout = ()=>{
    {
        return(
        <div className={styles.layout}>
          <Header/>
          <Outlet/>
        </div>
        )
      }
}