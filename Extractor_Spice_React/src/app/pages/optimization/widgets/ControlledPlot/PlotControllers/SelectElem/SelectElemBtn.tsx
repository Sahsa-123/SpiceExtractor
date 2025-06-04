import { PagePopUpWindow } from "../../../../../../../core/widgets";
import { CPlotUploadBtnProps } from "./api";
import { SelectElemForm } from "./SelectElemForm";
import { PagePopUpWindowI } from "../../../../../../../core/widgets";

export const SelectElemBtn: React.FC<CPlotUploadBtnProps> = ({ config }) => {
  const popupConfig: PagePopUpWindowI["config"] = {
    openBtn: { children: "Выбрать элемент" },
    closeBtn: { children: "", styleModification: ["crossBtn"] }
  };

  return (
    <PagePopUpWindow config={popupConfig}>
      < SelectElemForm config={config} />
    </PagePopUpWindow>
  );
};
