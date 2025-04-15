import { Container } from "../../../core/templates/Container/Container"
import { Button } from "../../../core/UI/Buttons/Button"
import styles from "./Header.module.css"

export const Header = ()=>{
    return (
    <header>
      <Container>
      <ul className={`${styles["header__menu"]}`} id="header-modal-menu">
          <li><Button clickHandler={()=>console.log("Привет от Проектов)")} styleModification={["flat-bottom"]}>Проекты</Button></li>
          <li><Button styleModification={["flat-bottom"]}>УПравление графиком</Button></li>
          <li><Button styleModification={["flat-bottom"]}>Параметры фильтрации</Button></li>
        </ul>
      </Container>
    </header>
    )
}