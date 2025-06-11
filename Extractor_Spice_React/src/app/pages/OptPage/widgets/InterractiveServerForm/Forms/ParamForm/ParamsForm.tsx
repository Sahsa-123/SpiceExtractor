import { useISFContext } from "../../childIndex";
import { ParamsFormProps } from "./api";
import styles from "./ParamsForm.module.css";
import {
  GlobalParamsFormContext,
  LocalParamsFormContext,
} from "./context";
import type {
  GlobalParamType,
  LocalParamType,
} from "./schema";
import { useEffect, useState } from "react";
import type { Path } from "react-hook-form";

export const ParamsForm: React.FC<ParamsFormProps> = ({
  outerStyles = null,
  height,
  width,
  variant,
}) => {
  const globalCtx = useISFContext<GlobalParamType>(GlobalParamsFormContext);
  const localCtx = useISFContext<LocalParamType>(LocalParamsFormContext);
  const ctx = variant === "glob" ? globalCtx : localCtx;

  const [filter, setFilter] = useState("");

  const data = ctx?.data;
  const register = ctx?.register;
  const formSubmit = ctx?.formSubmit;
  const reset = ctx?.reset;

  useEffect(() => {
    if (data && reset) reset(data);
  }, [data, reset]);

  if (!data || !register || !formSubmit) return null;

  const filtered = Object.entries(data).filter(([key]) =>
    key.toLowerCase().includes(filter.toLowerCase())
  );

  const style = { height, width };

  return (
    <form
      onSubmit={formSubmit}
      className={`${styles["form"]} ${outerStyles || ""}`}
      style={style}
    >
      <input
        className={styles["form__searchbar"]}
        placeholder="Поиск..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className={styles["form__table-container"]}>
        <div className={`${styles["form__row"]} ${styles["form__row--header"]}`}>
          {variant === "local" && (
            <div className={styles["form__cell"]}>checked</div>
          )}
          <div className={styles["form__cell"]}>name</div>
          <div className={styles["form__cell"]}>value</div>
          <div className={styles["form__cell"]}>min</div>
          <div className={styles["form__cell"]}>max</div>
        </div>

        <div className={styles["form__table-body"]}>
          {filtered.map(([name]) => (
            <div
              key={name}
              className={`${styles["form__row"]} ${styles["form__row--standard"]}`}
            >
              {variant === "local" && (
                <div className={styles["form__cell"]}>
                  <input
                    type="checkbox"
                    {...register(
                      `${name}.checked` as Path<LocalParamType>
                    )}
                  />
                </div>
              )}
              <div className={styles["form__cell"]} title={name}>
                {name}
              </div>
              <div className={styles["form__cell"]}>
                <input
                  type="number"
                  step="any"
                  {...register(
                    `${name}.value` as Path<GlobalParamType | LocalParamType>,
                    { valueAsNumber: true }
                  )}
                />
              </div>
              <div className={styles["form__cell"]}>
                <input
                  type="number"
                  step="any"
                  {...register(
                    `${name}.min` as Path<GlobalParamType | LocalParamType>,
                    { valueAsNumber: true }
                  )}
                />
              </div>
              <div className={styles["form__cell"]}>
                <input
                  type="number"
                  step="any"
                  {...register(
                    `${name}.max` as Path<GlobalParamType | LocalParamType>,
                    { valueAsNumber: true }
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
