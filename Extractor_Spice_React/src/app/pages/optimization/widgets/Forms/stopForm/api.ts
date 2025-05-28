export interface StopFormProps {
  stepId: string;
  config: {
    host: string;
    endpoints: {
      get: string;
      post: string;
    };
  };
  height: `${number}px`|`${number}%`|"auto";
  width: `${number}px`|`${number}%`|"auto";

  outerStyles?: string | null;
}
