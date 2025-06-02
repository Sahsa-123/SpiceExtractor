import { useForm, FieldValues } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  validateWithZodSchema,
  JSONResponseConverter,
  GETRequest,
} from "../../../../../core/webAPI";
import { ISFProps } from "./api";
import { useEffect } from "react";

export const ISF = <T extends FieldValues>({
  stepId,
  formName,
  schema,
  config,
  context,
  children,
}: ISFProps<T>) => {
  const { host, endpoints } = config;
  const queryClient = useQueryClient();
  const queryKey = [formName, stepId];

  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery<T>({
    queryKey,
    queryFn: async () => {
      const res = await GETRequest(host, endpoints.get, `id=${stepId}`);
      if (!res.isSuccessful) throw res.data;

      const json = await JSONResponseConverter(res.data);
      if (!json.isSuccessful) throw json.data;

      const validated = validateWithZodSchema({ data: json.data, schema });
      if (!validated.isSuccessful) throw validated.data;

      return validated.data;
    },
    placeholderData: () => {
      // Получаем предыдущее значение из кэша
      return queryClient.getQueryData(['users']);
    },
  });

  const { 
    register, 
    handleSubmit, 
    reset 
  } = useForm<T>();

  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: T) => {
      const url = `${host}/${endpoints.post}?id=${stepId}`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const formSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isLoading) return <>Загрузка...</>;
  if (isError || !data) return <>Ошибка загрузки</>;

  return (
    <context.Provider value={{ data, formSubmit, register }}>
      {children}
    </context.Provider>
  );
};

