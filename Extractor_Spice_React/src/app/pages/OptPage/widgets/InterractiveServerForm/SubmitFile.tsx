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
import { btnProps, Button } from "../../../../../core/UI";
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

  const btnStyles:btnProps["styleModification"] =ctx.isLoading ? ["btn--white_n_blue", "btn--white-loading"]: ["btn--white_n_blue"]
  return (
    <Button
      styleModification={btnStyles}
      disabled={ctx.isLoading}
      clickHandler={ctx.formSubmit}
    >
      Сохранить
    </Button>
  );
};
