export interface popUpWindowI {
    syncFuncs:{
        close:()=>void,
        updateData:()=>void
    },
    outerStyles?: string|null 
}