import { btnProps, Button } from "../../../core/UI"
import styles from "./Header.module.css"
import { useNavigate } from "react-router"

export const Header = ()=>{
  const navigate = useNavigate();
  const mainPageBtnConfig:btnProps={
    styleModification:["flat-bottom"],
    clickHandler:()=>navigate("/"),

  }
  const optPageBtnConfig:btnProps={
    styleModification:["flat-bottom"],
    clickHandler:()=>{
      console.log("Нажали")
      return navigate("/opt");
    }
  }
    return (
    <header className={styles["header"]}>
        <ul className={`${styles["header__menu"]}`} id="header-modal-menu">
          <li><Button {...mainPageBtnConfig}>Статистическая обработка</Button></li>
          <li><Button {...optPageBtnConfig}>Оптимизация</Button></li>
        </ul>
    </header>
    )
}