import { useQuery } from "@tanstack/react-query";
import { Button } from "../../../core/UI/Buttons/Button";
import styles from "./MainPage.module.css";
import { Graph } from "./widgets/Graph/Graph";
import { Settings } from "./widgets/Settings/Settings";
import chartSettingsGET from "./getSettings";
import {chartSettingsDataSchema,settingsPropps,} from "./widgets/Settings/api";

export const MainPage = () => {
  const { data, status } = useQuery({
    queryKey: ["chart-settings"],
    queryFn: () => chartSettingsGET(),
  });

  if (status === "error") return <div>Ошибка</div>;
  if (status === "pending") return <div>Загрузка...</div>;

  const parsedData = chartSettingsDataSchema.safeParse(data?.data);
  
  if (!parsedData.success) {
    console.error("Validation error:", parsedData.error);
    return <div>Ошибочка вышла</div>;
  }

  const settingsConfig: settingsPropps = {
    config: {
      fieldsets: parsedData.data,
      btnAcceptAll: {
        children: "Выбрать все",
        type: "button",
      },
      btnRejectAll: {
        children: "Сбросить все",
        type: "button",
      },
    },
    syncFunc: () => console.log("Синхронизация"),
  };

  return (
    <main className={styles.main} id="app">
      <Graph />
      <div>
        <Button type="button">Отправить данные</Button>
      </div>
      <Settings outerStyles={styles.settings} {...settingsConfig} />
    </main>
  );
};
    // const data:settingsPropps["config"]["fieldsets"] = {
    //     "chip-number-fieldset": [
    //         {
    //             value: "Kristal_0p6_waf0chip1",
    //             checked: "true"
    //         }
    //     ],
    //     "inner-nominal-fieldset": [
    //         {
    //             "value": "D06p_W35_L3p5"
    //         },
    //         {
    //             "value": "D09p_W100_L1p7",
    //             "checked": "true"
    //         },
    //         {
    //             "value": "D16n_W35_L3p5",
    //             "checked":"true"
    //         },
    //         {
    //             "value": "D19n_W100_L1p7"
    //         }
    //     ],
    //     "electric-fieldset": [
    //         {
    //             "value": "soi_dc_idvd"
    //         },
    //         {
    //             "value": "soi_dc_idvg"
    //         }
    //     ],
    //     "temperature-fieldset": [
    //         {
    //             "value": "300K",
    //             "checked": "true"
    //         }
    //     ]
    // }