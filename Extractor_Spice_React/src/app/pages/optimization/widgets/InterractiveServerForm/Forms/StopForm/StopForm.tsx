import styles from "./stopForm.module.css";
import { useISFContext } from "../../childIndex";
import { StopFormContext } from "./context";
import { StopFormProps } from "./api";


export const StopForm: React.FC<StopFormProps> = ({
  outerStyles = null,
  height,
  width,
}) => {
  const ctx = useISFContext(StopFormContext);
  if (!ctx) return null;

  const { register, formSubmit } = ctx;

  const externalStyles = { height, width };

  return (
    <form
      style={externalStyles}
      className={`${styles["form"]} ${outerStyles || ""}`}
      onSubmit={formSubmit}
    >
        <div className={styles["form__fieldset"]}>
          <div className={styles["form__input-group"]}>
            <label>iterNum</label>
            <input type="number" {...register("iterNum", { valueAsNumber: true })} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>relMesErr (%)</label>
            <input type="number" min={0} max={100} step="any" {...register("relMesErr", { valueAsNumber: true })} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>absMesErr</label>
            <input type="number" step="any" {...register("absMesErr", { valueAsNumber: true })} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>paramDelt (%)</label>
            <input type="number" min={0} max={100} step="any" {...register("paramDelt", { valueAsNumber: true })} />
          </div>
        </div>
    </form>
  );
};
