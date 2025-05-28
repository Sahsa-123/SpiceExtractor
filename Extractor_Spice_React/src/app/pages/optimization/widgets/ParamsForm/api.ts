export type ParamsFormProps =
  | {
      variant: "local";
      config: {
        stepId: string;
        host: string;
        endpoints: {
          get: string;
          post: string;
        };
      };
    outerStyles?:string,
    height: `${number}px`|`${number}%`|"auto";
    width: `${number}px`|`${number}%`|"auto";
    }
  | {
      variant: "glob";
      config: {
        host: string;
        endpoints: {
          get: string;
          post: string;
        };
      };
      outerStyles?:string,
      height: `${number}px`|`${number}%`|"auto";
      width: `${number}px`|`${number}%`|"auto";
    };
