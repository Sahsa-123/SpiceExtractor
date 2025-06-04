/*parent dependencies*/
import { FieldsetsType } from "../../childIndex"
/*parent dependencies*/

export interface GraphI{
    plotData: FieldsetsType,
    outerStyles:string|null,
    config:{
        host:string,
        endpoint:string
    }
}