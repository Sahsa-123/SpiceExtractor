import { Button } from "../../../core/UI"
import { PageCenteredContainer } from "../../../core/Wrappers"
import styles from "./Header.module.css"

export const Header = ()=>{
    return (
    <header>
      <PageCenteredContainer>
        <ul className={`${styles["header__menu"]}`} id="header-modal-menu">
          <li><Button styleModification={["flat-bottom"]}>Проекты</Button></li>
          <li><Button styleModification={["flat-bottom"]}>УПравление графиком</Button></li>
          <li><Button styleModification={["flat-bottom"]}>Параметры фильтрации</Button></li>
        </ul>
      </PageCenteredContainer>
    </header>
    )
}