import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../../../../../../../core/UI";
import { UploadFormProps } from "../api";
import { useSetAtom } from "jotai";
import { graphAtom, isGraphFetchingAtom } from "../../../sharedState";
import { PlotDataSchema } from "../../../sharedState";
import styles from "./UploadForm.module.css"

export const UploadForm: React.FC<UploadFormProps> = ({ config }) => {
  const { host, endpoint } = config;
  const setGraph = useSetAtom(graphAtom);
  const setFetching = useSetAtom(isGraphFetchingAtom);

  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<{
    chartSettings: FileList;
  }>();

  const { mutateAsync: uploadZip } = useMutation({
    mutationFn: async (formData: FormData) => {
      setFetching(true);
      const response = await fetch(`${host}/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Ошибка загрузки");
      setFetching(false)
      return response.json();
    },
    onSuccess: (data) => {
      const result = PlotDataSchema.safeParse(data);
      if (result.success) {
        setGraph({ data: result.data, isError: false });
      } else {
        setGraph({ data: null, isError: true });
      }
      reset();
    },
    onError: () => {
      alert("Ошибка при загрузке файла");
      setGraph({ data: null, isError: true });
    }
  });

  const onSubmit = async (data: { chartSettings: FileList }) => {
    const file = data.chartSettings[0];
    if (!file || !file.name.endsWith(".zip")) {
      alert("Пожалуйста, выберите ZIP-файл");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    await uploadZip(formData);
  };

  return (
    <form className={styles["form"]} onSubmit={handleSubmit(onSubmit)}>
      <input type="file" accept=".zip" {...register("chartSettings")} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Загрузка..." : "Отправить"}
      </Button>
    </form>
  );
};
