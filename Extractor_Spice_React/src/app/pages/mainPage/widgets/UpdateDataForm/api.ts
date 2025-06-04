export interface UpdateDataFormI {
    syncFunc:()=>void
    config:{
        host:string,
        endpoint:string
    }
    outerStyles?: string|null 
}