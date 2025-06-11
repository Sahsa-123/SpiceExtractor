export interface ISLProps {
  config: {
    host: string; 
    endpoints: {
      getList: string;
      addEP: string;
      deleteEP: string;
      changeOrderEP: string;
    };
  };
  syncFunc: (data: string | null) => void;
  outerStyles?: string | null;
  height: `${number}px` | `${number}%` | "auto";
  width: `${number}px` | `${number}%` | "auto";
}
