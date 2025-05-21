export interface InputFieldProps {
  styleModification?: StyleModificationType;
  outerStyles?: string | null;
  placeholder?: string;
  enterHandler?: (value: string) => void;
  blurHandler?: (value: string) => void;
  disabled?: boolean;
  defaultValue?: string;
  type?: PermittedInputType;
}

type PermittedStyles = "input";
type StyleModificationType = PermittedStyles[];

type PermittedInputType =
  | "text"
  | "email"
  | "number"
  | "search"
  | "url"
  | "tel"
  | "password";
