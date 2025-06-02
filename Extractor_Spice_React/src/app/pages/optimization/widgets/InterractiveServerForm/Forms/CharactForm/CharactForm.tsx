import styles from "./CharactForm.module.css";
import { useISFContext } from "../../context";
import { StepsCharactFormContext } from "./context";
import type { Path } from "react-hook-form";
import type { StepsCharactSchemaType } from "./schema";
import { CharactFormProps } from "./api";


export const StepsCharactForm: React.FC<CharactFormProps> = ({
  outerStyles = null,
  height,
  width,
}) => {
  const ctx = useISFContext(StepsCharactFormContext);
  if (!ctx) return null;

  const { register, formSubmit, data } = ctx;
  const externalStyles = { height, width };

  return (
    <form
      style={externalStyles}
      onSubmit={formSubmit}
      className={`${styles["form"]} ${outerStyles || ""}`}
    >
      <div className={styles["form__inputPart"]}>
        {Object.keys(data).map((name) => {
          const block = data[name as keyof StepsCharactSchemaType];

          return (
            <fieldset key={name} className={styles["form__fieldset"]}>
              <legend className={styles["form__legend"]}>{name}</legend>

              <label>
                <input
                  type="checkbox"
                  {...register(`${name}.checked` as Path<StepsCharactSchemaType>)}
                />
                Активно
              </label>

              {Object.entries(block)
                .filter(([key]) => key !== "checked")
                .map(([key]) => {
                  const path = `${name}.${key}` as Path<StepsCharactSchemaType>;
                  return (
                    <div key={key} className={styles["form__input-group"]}>
                      <label>{key}</label>
                      <input
                        type="number"
                        step="any"
                        {...register(path, { valueAsNumber: true })}
                      />
                    </div>
                  );
                })}
            </fieldset>
          );
        })}
      </div>
    </form>
  );
};
