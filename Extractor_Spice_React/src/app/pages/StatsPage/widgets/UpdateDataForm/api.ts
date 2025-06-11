export interface UpdateDataFormI {
    syncFunc:()=>void
    webConfig:{
        host:string,
        endpoint:string
    }
    outerStyles?: string|null 
}