import { Button } from "../../../../../../core/UI/Buttons";
// import { Button } from "";
import { UFCheckbox } from "../../../../../../core/UI/Checkboxes";
import { fieldsetI } from "./api";

import styles from "./Fieldset.module.css";


export const Fieldset:React.FC<fieldsetI>=({checkboxes, leftBtnProps,rightBtnProps})=>{
    const inputs = checkboxes.map((obj) => (<UFCheckbox {...obj}/>));
    return( 
        <fieldset>
            {inputs}
            <div className={styles["fieldset__interractive-block"]}>
                <Button {...leftBtnProps}>Выбрать все</Button>
                <Button {...rightBtnProps}>Сбросить</Button>
            </div>
        </fieldset>
    )
}