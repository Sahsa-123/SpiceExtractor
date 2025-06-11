import { btnProps, Button } from "../../../core/UI"
import styles from "./Header.module.css"
import { useNavigate, useLocation } from "react-router";
import { getStyles } from "./utils";


export const Header = ()=>{
  const navigate = useNavigate();
  const location = useLocation();

  const mainPageBtnConfig:btnProps={
    styleModification:getStyles(location.pathname, "/"),
    clickHandler:()=>navigate("/"),
  }
  const optPageBtnConfig:btnProps={
    styleModification:getStyles(location.pathname, "/opt"),
    clickHandler:()=>navigate("/opt")
  }
  
  return (
    <header className={styles["header"]}>
        <ul className={`${styles["header__menu"]}`} id="header-modal-menu">
          <li><Button {...mainPageBtnConfig}>Предварительная обработка</Button></li>
          <li><Button {...optPageBtnConfig}>Оптимизация</Button></li>
        </ul>
    </header>
  )
}

