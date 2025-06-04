import React from "react";
import { PagePopUpWindow, PagePopUpWindowI } from "../../../../../../../core/widgets";
import { UploadForm } from "./form/UploadForm";
import { UploadFormProps } from "./api";
import { isGraphFetchingAtom } from "../../sharedState";
import { useAtomValue } from "jotai";

export const UploadDataBtn: React.FC<UploadFormProps> = ({ config }) => {
  const isFetching = useAtomValue(isGraphFetchingAtom);
  const popupConfig:PagePopUpWindowI["config"] = {
      openBtn: {
      children: "Загрузить измерения",
      disabled: isFetching
    },
    closeBtn: {
      children: "",
      styleModification: ["crossBtn"] as const
    }
  };

  return (
    <PagePopUpWindow config={popupConfig}>
      <UploadForm config={config} />
    </PagePopUpWindow>
  );
};
