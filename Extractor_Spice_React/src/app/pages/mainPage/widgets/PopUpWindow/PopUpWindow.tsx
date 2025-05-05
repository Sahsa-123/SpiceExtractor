import { useMutation } from "@tanstack/react-query";
import { Button } from "../../../../../core/UI";
import { popUpWindowI } from "./api";
import { useForm } from "react-hook-form";
import  styles  from "./PopUpWindow.module.css"

export const PopUpWindow: React.FC<popUpWindowI> = ({syncFuncs}) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{
    chartSettings: FileList;
  }>();
  // Мутация для отправки файла
  const { mutateAsync: uploadZip } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('http://127.0.0.1:8000/upload-zip', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok){
        console.log(response)
        throw new Error('Ошибка загрузки файла');
      }
      return response.json();
    },
    onSuccess:()=>syncFuncs.updateData()
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
      const result = await uploadZip(formData);
      console.log('Файл успешно загружен:', result);
      
      // Дополнительные действия после успешной загрузки
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Произошла ошибка при загрузке файла');
    }
  };

  return (
    <div className={styles.popUpWindow}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        accept=".zip"
        {...register("chartSettings", {
          required: "Выберите файл для загрузки",
        })}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Идет отправка...' : 'Отправить данные'}
      </Button>
    </form>
    <Button styleModification={["crossBtn"]} outerStyles={styles["popUpWindow__closeBtn"]} clickHandler={syncFuncs.close}/>
    </div>
  );
};