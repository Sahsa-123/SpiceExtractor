import React from "react";
import { PagePopUpWindow, PagePopUpWindowI } from "../../../../../../../core/widgets";
import { UploadForm } from "./form/UploadForm";
import { UploadFormProps } from "./api";

export const UploadDataBtn: React.FC<UploadFormProps> = ({ config }) => {
  const popupConfig:PagePopUpWindowI["config"] = {
      openBtn: {
      children: "Загрузить измерения"
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
