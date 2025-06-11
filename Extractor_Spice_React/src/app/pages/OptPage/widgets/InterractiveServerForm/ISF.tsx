import { useForm, FieldValues } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  validateWithZodSchema,
  JSONResponseConverter,
  GETRequest,
} from "../../../../../core/webAPI";
import type { ISFProps } from "./api";
import { useEffect } from "react";
import { Loader, parentStyles } from "../../../../../core/UI/Loader";
import { CenteredContainer } from "../../../../../core/Wrappers";
import { BadNetwork, ServerStatusError} from "../../../../../core/webAPI/Requests/errors";

/**
 * Универсальный контейнер для форм с GET/POST и поддержкой queryParams
 */
export const ISF = <T extends FieldValues>({
  queryParams,
  formName,
  schema,
  config,
  context,
  children,
  width,
  height
}: ISFProps<T>) => {
  const { host, endpoints } = config;
  const queryClient = useQueryClient();

  // 🔧 Подготовка query строки
  const queryString = queryParams
    ? Object.entries(queryParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")
    : null;

  const queryKey = [formName, queryParams];

  // 📥 Получение данных
  const { data, isLoading, isError, error  } = useQuery<T>({
    queryKey,
    queryFn: async () => {
      const res = await GETRequest(host, endpoints.get, queryString);
      if (!res.isSuccessful) throw res.data;

      const json = await JSONResponseConverter(res.data);
      if (!json.isSuccessful) throw json.data;

      const validated = validateWithZodSchema({ data: json.data, schema });
      if (!validated.isSuccessful) throw validated.data;

      return validated.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<T>();

  // ⏪ Сброс формы при обновлении данных
  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  // 📤 Отправка формы
  const mutation = useMutation({
    mutationFn: async (payload: T) => {
      const postUrl =
        queryParams && Object.keys(queryParams).length
          ? `${host}/${endpoints.post}?${queryString}`
          : `${host}/${endpoints.post}`;

      await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey })
    },
    onError: ()=>{
      alert("Не удалось обновить данные!")
    }
  });

  const formSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isLoading){
    return(
      <div style={{width,height}}className={parentStyles}>
        <Loader visible={true}/>
      </div>
    )
  };
  if (isError || !data){
    let message = ""
    if (error instanceof ServerStatusError) {
      message = "Сервер временно недоступен";
    } else if (error instanceof BadNetwork) {
      message = "Проверьте интернет-соединение";
    } else {
      message = "Попробуйте позже";
    }
    return(
      <CenteredContainer flexDirection="column" width="100%" height="100%">
        <span>Ошибка загрузки</span>
        {message}
      </CenteredContainer>
    )
  }

  return (
    <context.Provider value={{ data, formSubmit, register, reset, isLoading:mutation.isPending }}>
      {children}
    </context.Provider>
  );
};
