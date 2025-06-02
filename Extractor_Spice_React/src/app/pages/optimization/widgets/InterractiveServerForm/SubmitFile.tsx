// import { useContext } from "react";
// import { Button } from "../../../../../core/UI";
// import { ISFContext } from "./context"; // путь поправь под проект

// export const SubmitButton: React.FC = () => {
//   const ctx = useContext(ISFContext);
//   if (!ctx) return null;

//   return (
//     <Button type="button" clickHandler={ctx.formSubmit}>
//       Сохранить
//     </Button>
//   );
// };
import { useContext } from "react";
import { Button } from "../../../../../core/UI";
import type { FieldValues } from "react-hook-form";
import type { ISFContextType } from "./context";

interface SubmitButtonProps<T extends FieldValues> {
  context: React.Context<ISFContextType<T> | null>;
}

export const SubmitButton = <T extends FieldValues>({
  context,
}: SubmitButtonProps<T>) => {
  const ctx = useContext(context);
  if (!ctx) return null;

  return (
    <Button type="button" styleModification={["btn--white_n_blue"]} clickHandler={ctx.formSubmit}>
      Сохранить
    </Button>
  );
};
