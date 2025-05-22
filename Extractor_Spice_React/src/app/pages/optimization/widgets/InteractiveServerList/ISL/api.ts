export interface ISLProps{
    config:{
        endpoints: {
            getList: string;
            addEP: string;
            deleteEP: string;
            changeOrderEP: string;
        };
    }
    syncFunc: (data: string|null) => void;
    outerStyles?: string|null 
}

