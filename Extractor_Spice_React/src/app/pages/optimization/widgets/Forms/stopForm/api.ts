export interface StopFormProps {
  stepId: string;
  config: {
    host: string;
    endpoints: {
      get: string;
      post: string;
    };
  };
  outerStyles?: string | null;
}
