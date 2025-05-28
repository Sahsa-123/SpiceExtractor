/*UI dependencies*/
import { btnProps } from "../../UI"
/*UI dependencies*/

export interface PagePopUpWindowI {
    config:{
        openBtn:Pick<btnProps, "styleModification"|"children">,
        closeBtn:Pick<btnProps, "styleModification"|"children">
    }
    outerStyles?: string|null 
    children: React.ReactElement
}