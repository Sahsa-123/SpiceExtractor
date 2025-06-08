/*parent dependencies*/
import { FieldsetsType } from "../../childIndex"
/*parent dependencies*/

export interface GraphI{
    plotData: FieldsetsType,
    outerStyles:string|null,
    webConfig:{
        host:string,
        endpoint:string
    }
}