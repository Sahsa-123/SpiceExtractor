export interface ParamsFormProps {
  outerStyles?: string | null;
  height: `${number}px` | `${number}%` | "auto";
  width: `${number}px` | `${number}%` | "auto";
  variant: "glob" | "local";
}
