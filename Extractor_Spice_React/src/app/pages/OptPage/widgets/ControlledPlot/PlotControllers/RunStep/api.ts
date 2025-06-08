export interface RunStepButtonProps {
  config: {
    host: string;
    endpoint: string;
    queryParams?: Record<string, string>; // 👈 сделай опциональным
  };
  isDisabled: boolean;
}
