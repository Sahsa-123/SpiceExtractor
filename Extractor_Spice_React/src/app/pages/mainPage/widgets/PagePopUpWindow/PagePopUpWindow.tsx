import { Button } from "../../../../../core/UI";
import { PopUpTemplate } from "../../../../../core/Wrappers";
import { PagePopUpWindowI } from "./api";
import  styles  from "./PagePopUpWindow.module.css"
import { useState } from "react";

export const PagePopUpWindow: React.FC<PagePopUpWindowI> = ({config, children}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return(
    <>
    <Button {...config.openBtn} outerStyles={`${styles["popUpBtn"]} ${isOpen?"":styles["visible"]}`} clickHandler={()=>setIsOpen((cur)=>!cur)}/>
    <PopUpTemplate color="black" isVisible={isOpen}>
        <div className={styles.popUpWindow}>
        {children}
        <Button {...config.closeBtn} outerStyles={styles["popUpWindow__closeBtn"]} clickHandler={()=>setIsOpen(false)}/>
      </div>
    </PopUpTemplate>
    </>
  )
};