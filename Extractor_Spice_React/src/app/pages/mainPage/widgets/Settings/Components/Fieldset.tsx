import { fieldsetI } from "./api";
import styles from "./Fieldset.module.css";
/*dependencies*/
import { Button } from "../../../../../../core/UI/Buttons";
import { UFCheckbox } from "../../../../../../core/UI/Checkboxes";
/*dependencies*/

export const Fieldset:React.FC<fieldsetI>=({checkboxes, leftBtnProps,rightBtnProps})=>{
    const inputs = checkboxes.map((obj) => (<UFCheckbox outerStyles={styles["fieldset__input-wrapper"]} {...obj}/>));
    return( 
        <fieldset className={styles["fieldset"]}>
            <div className={styles["fieldset__input-block"]}>
                {inputs}
            </div>
            <div className={styles["fieldset__interractive-block"]}>
                <Button {...leftBtnProps}>Выбрать все</Button>
                <Button {...rightBtnProps}>Сбросить</Button>
            </div>
        </fieldset>
    )
}