/*core dependencies*/
import { btnProps } from "../../../../../core/UI"
/*core dependencies*/

export interface PagePopUpWindowI {
    config:{
        openBtn:Pick<btnProps, "styleModification"|"children">,
        closeBtn:Pick<btnProps, "styleModification"|"children">
    }
    outerStyles?: string|null 
    children: React.ReactElement
}