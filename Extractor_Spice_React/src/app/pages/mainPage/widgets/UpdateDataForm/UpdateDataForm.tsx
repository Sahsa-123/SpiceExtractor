/*core dependencies*/
import { Button } from "../../../../../core/UI";
/*core dependencies*/

/*local dependecies*/
import { UpdateDataFormI } from "./api";
import  styles  from "./UpdateDataForm.module.css"
/*local dependecies*/

/*other*/
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
/*other*/

export const UpdateDataForm: React.FC<UpdateDataFormI> = ({syncFunc, config}) => {
  const { register, handleSubmit, formState: { isSubmitting },reset } = useForm<{
    chartSettings: FileList;
  }>();
  const { mutateAsync: uploadZip } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${config.host}/${config.endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok){
        console.log(response)
        throw new Error('Ошибка загрузки файла');
      }
      return response.json();
    },
    onSuccess:()=>{
      reset()
      syncFunc()
    }
  });
  // Обработчик отправки формы
  const onSubmit = async (data: { chartSettings: FileList }) => {
    const file = data.chartSettings[0];
    
    // Проверка типа файла
    if (!file?.type.includes('zip')) {
      alert('Пожалуйста, выберите ZIP-архив');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // 'file' - ключ, ожидаемый сервером

    try {
      await uploadZip(formData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Произошла ошибка при загрузке файла');
    }
  };
return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
    <input
        type="file"
        accept=".zip"
        {...register("chartSettings", {
        required: "Выберите файл для загрузки",
        })}
    />
    <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Идет отправка...' : 'Отправить'}
    </Button>
    </form>
);
};