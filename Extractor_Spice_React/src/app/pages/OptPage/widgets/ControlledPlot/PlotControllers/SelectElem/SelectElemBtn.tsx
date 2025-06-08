import { PagePopUpWindow } from "../../../../../../../core/widgets";
import { CPlotUploadBtnProps } from "./api";
import { SelectElemForm } from "./SelectElemForm";
import { PagePopUpWindowI } from "../../../../../../../core/widgets";
import { useAtomValue } from "jotai";
import { isGraphFetchingAtom } from "../../sharedState";

export const SelectElemBtn: React.FC<CPlotUploadBtnProps> = ({ config }) => {
  const isFetching = useAtomValue(isGraphFetchingAtom)
  const popupConfig: PagePopUpWindowI["config"] = {
    openBtn: { children: "Выбрать элемент", disabled:isFetching},
    closeBtn: { children: "", styleModification: ["crossBtn"] }
  };

  return (
    <PagePopUpWindow config={popupConfig}>
      < SelectElemForm config={config} />
    </PagePopUpWindow>
  );
};
