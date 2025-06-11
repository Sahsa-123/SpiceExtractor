# 📘 Документация проекта

# 📘 Полная техническая документация: фронтенд-проект SPICE-экстрактора

## 📄 Страница `StatsPage`

### 📊 Виджет `Graph`
**Классификация**: Виджет / StatsPage / widgets / Graph

**Файлы**:
- `Graph.tsx`
- `api.ts`
- `hooks.ts`
- `utils.ts`
- `webAPI.ts`
- `index.ts`

**API**:
```ts
interface GraphI {
  plotData: any[];
  outerStyles?: string;
  webConfig: {
    host: string;
    endpoint: string;
  };
}
```

**Принцип работы**:
Использует `useGetPlot` для получения данных графика с сервера. Фильтрует входные данные с помощью `pickChecked`. Обрабатывает три типа ошибок, визуализирует через `react-plotly.js`.

**Исходный код**:
```tsx
/*local dependecies*/
import {GraphI} from "./api";
import {useGetPlot} from "./hooks";
import {pickChecked} from "./utils";
/*local dependecies*/

import {CenteredContainer} from "../../../../../core/Wrappers/Containers/CenteredContainer"; // если ещё не импортирован

/*other*/
import Plot from "react-plotly.js";
import {getChartPlot} from "./webAPI";
import {Loader, parentStyles} from "../../../../../core/UI/Loader";
import {ClientStatusError, ServerStatusError, unknownError} from "../../../../../core/webAPI/Requests/errors";
/*other*/

export const Graph: React.FC<GraphI> = ({plotData, 
  outerStyles ,
  webConfig}) => {const filtered = pickChecked(plotData, "chart-plot");
  const {data, 
    layout, 
    isFetching,
    error} = useGetPlot(filtered, ()=>getChartPlot({params:plotData||{}, host:webConfig.host, endpoint:webConfig.endpoint}));

  return (
    <section className={`${outerStyles || ""} ${parentStyles}`}>
    {error && !isFetching ? (
      <CenteredContainer width="100%" height="100%">
        {filtered.length===1?
        <span>Характеристики не выбраны</span>
        :
          <CenteredContainer width="100%" height="100%">
            {error instanceof ClientStatusError && (
              <span>Характеристики выбраны некорректно</span>
            )}
            {error instanceof ServerStatusError && (
              <span>Сервер временно недоступен. Попробуйте позже.</span>
            )}
            {error instanceof unknownError && (
              <span>Произошла непредвиденная ошибка</span>
            )}
          </CenteredContainer>}
      </CenteredContainer>
    ) : (
      <Plot
        data={data || []}
        layout={layout}
        config={{responsive: true,
          displaylogo: false,}}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
      />
    )}
      <Loader visible={isFetching}/>
  </section>
  );};

```

---

### 🧩 Подмодуль `Fieldset` (в составе `Settings`)
**Классификация**: Подмодуль-компонент / StatsPage / widgets / Settings / components

**Файлы**:
- `Fieldset.tsx`
- `Fieldset.module.css`
- `api.ts`
- `index.ts`

**API**:
```ts
interface fieldsetI {
  checkboxes: UFCheckboxI[];
  leftBtnProps: ButtonProps;
  rightBtnProps: ButtonProps;
}
```

**Роль внутри `Settings`**:
- Визуализирует одну "группу параметров" (fieldset).
- Вставляется динамически через `createFieldsets`.

**Принцип работы**:
- Рендерит список флажков и две кнопки управления. Использует UI-элементы `UFCheckbox` и `Button`. Разметка с БЭМ-классами, поддерживает скроллирование.

**Исходный код**:
```tsx
/*local dependecies*/
import {fieldsetI} from "./api";
import styles from "./Fieldset.module.css";
/*local dependecies*/

/*core dependencies*/
import {Button} from "../../../../../../core/UI";
import {UFCheckbox} from "../../../../../../core/UI";
/*core dependencies*/

export const Fieldset:React.FC<fieldsetI>=({checkboxes, 
    leftBtnProps, 
    rightBtnProps})=>{const inputs = checkboxes.map((obj) => (<UFCheckbox key={obj.value} outerStyles={styles["fieldset__input-wrapper"]} {...obj}/>));
    return( 
        <fieldset className={styles["fieldset"]}>
            <div className={styles["fieldset__input-block"]}>
                {inputs}
            </div>
            <div className={styles["fieldset__interractive-block"]}>
                <Button {...leftBtnProps}>Выбрать все</Button>
                <Button {...rightBtnProps}>Сбросить</Button>
            </div>
        </fieldset>
    )}
```

---

### 🧩 Виджет `Settings`
**Классификация**: Виджет / StatsPage / widgets / Settings

**Файлы**:
- `Settings.tsx`
- `Settings.module.css`
- `utils.tsx`
- `hooks.ts`
- `api.ts`
- `index.ts`

**API**:
```ts
interface settingsPropps {
  config: {
    fieldsets?: { [key: string]: CheckboxOption[] };
    btnAcceptAll: ButtonProps;
    btnRejectAll: ButtonProps;
  };
  syncFunc: (data: SettingsSyncData) => void;
  outerStyles?: string | null;
}
```

**Принцип работы**:
Создаёт форму с `react-hook-form`, автоматически следит за её изменением с помощью `useWatchFormState` и вызывает `syncFunc`. Использует `createFieldsets` и `createDefaultForm` для генерации `Fieldset`-ов.

**Исходный код**:
```tsx
/*local dependencies*/
import {SettingsSyncData, settingsPropps} from "./api"
import styles from "./Settings.module.css"
import {useWatchFormState} from "./hooks"
import {createDefaultForm, createFieldsets} from "./utils"
/*local dependencies*/

/*other*/
import {useForm} from "react-hook-form"
/*other*/

export const Settings: React.FC<settingsPropps>=({config, syncFunc, outerStyles=null})=>{const{register, setValue, watch} = useForm<SettingsSyncData>({defaultValues:createDefaultForm(config.fieldsets)})
    
    useWatchFormState(watch, syncFunc)
    return (
    <section className={`${outerStyles||""} ${styles["wrapper"]}`}>
        <form className={styles["settings__form"]} id="settings-form">
            {createFieldsets(config, register, setValue, "Загрузите измерения")}
        </form>
    </section>
    )}



```

---

### 🧩 Виджет `UpdateDataForm`
**Классификация**: Виджет / StatsPage / widgets / UpdateDataForm

**Файлы**:
- `UpdateDataForm.tsx`
- `UpdateDataForm.module.css`
- `api.ts`
- `index.ts`

**API**:
```ts
interface UpdateDataFormI {
  syncFunc: () => void;
  webConfig: {
    host: string;
    endpoint: string;
  };
}
```

**Принцип работы**:
Отображает простую форму выбора ZIP-файла, валидирует MIME-тип, отправляет на сервер через `fetch` и оборачивает в `useMutation`. После отправки сбрасывает форму и вызывает `syncFunc`.

**Исходный код**:
```tsx
/*core dependencies*/
import {Button} from "../../../../../core/UI";
/*core dependencies*/

/*local dependecies*/
import {UpdateDataFormI} from "./api";
import  styles  from "./UpdateDataForm.module.css"
/*local dependecies*/

/*other*/
import {useMutation} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
/*other*/

export const UpdateDataForm: React.FC<UpdateDataFormI> = ({syncFunc, webConfig}) => {const {register, handleSubmit, formState: {isSubmitting},reset} = useForm<{chartSettings: FileList;}>();
  const {mutateAsync: uploadZip} = useMutation({mutationFn: async (formData: FormData) => {const response = await fetch(`${webConfig.host}/${webConfig.endpoint}`, {method: 'POST',
        body: formData,});

      if (!response.ok){console.log(response)
        throw new Error('Ошибка загрузки файла');}
      return response.json();},
    onSuccess:()=>{reset()
      syncFunc()}});
  // Обработчик отправки формы
  const onSubmit = async (data: {chartSettings: FileList}) => {const file = data.chartSettings[0];
    
    // Проверка типа файла
    if (!file?.type.includes('zip')) {alert('Пожалуйста, выберите ZIP-архив');
      return;}

    const formData = new FormData();
    formData.append('file', file); // 'file' - ключ, ожидаемый сервером

    try {await uploadZip(formData);} catch (error) {console.error('Ошибка загрузки:', error);
      alert('Произошла ошибка при загрузке файла');}};
return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
    <input
        type="file"
        accept=".zip"
        {...register("chartSettings", {required: "Выберите файл для загрузки",})}
    />
    <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Идет отправка...' : 'Отправить'}
    </Button>
    </form>
);};
```

### 🧱 Компонент `GridLayout`

**Классификация**: Компонент / OptPage / GridLayout

**Файлы**:
- `GridLayout.tsx`
- `GridLayout.module.css`
- `utils.ts`
- `api.ts`
- `index.ts`

**API**:
```ts
interface GridLayoutProps {
  children: React.ReactElement[];
  columnWidths: string[];
  rowHeights: string[];
  height?: string;
  width?: string;
  outerStyles?: string;
  gridItemsAdditionalStyles?: string[];
}
```

**Принцип работы**:
Гибкая обёртка на CSS Grid. Принимает размеры строк/столбцов, применяет шаблоны и отрисовывает дочерние элементы в соответствующих ячейках. Автоматически добавляет классы `grid__item--n`.

**Ключевые детали**:
- `buildColTemplate` / `buildRowTemplate` возвращают шаблоны.
- Каждый элемент оборачивается в `div` с классом.
- Используется `overflow: auto` для защиты от переполнений.

**CSS (GridLayout.module.css)**:
```css
.grid {
  display: grid;
  gap: 1rem;
  overflow: auto;
}
.grid__item {
  overflow: auto;
}
.grid__item--4 {
  grid-column: 1 / 4;
  grid-row: 2 / 3;
}
```

**Код компонента (`GridLayout.tsx`)**:
```tsx
import React from 'react';
import styles from './GridLayout.module.css';
import {GridLayoutProps} from './api';
import {buildRowTemplate, buildColTemplate} from './utils';


export const GridLayout: React.FC<GridLayoutProps> = ({children, columnWidths, rowHeights, height,outerStyles="",gridItemsAdditionalStyles, width}) => {const colTemplate = buildColTemplate(columnWidths);
  const rowTemplate = buildRowTemplate(rowHeights);

  const additionalStyles={gridTemplateColumns: colTemplate,
        gridTemplateRows: rowTemplate,
        height,
        width}

  return (
    <div
      className={`${styles.grid} ${outerStyles}`}
      style={additionalStyles}
    >
      {children.map((child, index) => (
        <div key={index} className={`${styles.grid__item} ${styles[`grid__item--${index + 1}`]} ${gridItemsAdditionalStyles?gridItemsAdditionalStyles[index]||"":""}`}>
          {child}
        </div>
      ))}
    </div>
  );};


```

### 🧩 Виджет `PageCrowler`

**Классификация**: Виджет / OptPage / widgets / PageCrowler

**Файлы**:
- `PageCrowler.tsx`
- `PageCrowler.module.css`
- `api.ts`
- `index.ts`

**API**:
```ts
interface PageCrowlerProps {
  pages: Record<string, React.ReactNode>; // вкладки
  height?: string;
  width?: string;
  outerStyles?: string;
}
```

**Принцип работы**:
Компонент отображает вкладочный интерфейс, где каждая вкладка (tab) соответствует ключу из объекта `pages`. При нажатии активируется соответствующий компонент и отображается в контентной зоне.

**Ключевые детали**:
- Используется `useState` для отслеживания активной вкладки.
- Кнопки вкладок стилизуются по активности (`tab--active`).
- Контентная зона имеет 100% высоту (обязательное требование).

**CSS (`PageCrowler.module.css`)**:
```css
.crowler { display: flex; flex-direction: column; overflow: auto; }
.tabs { display: flex; overflow-y: auto; }
.tab { padding: 0.5rem 1rem; min-width: 100px; }
.tab--active { background-color: white; border: 2px solid #007bff; }
.content { height: 100%; overflow: auto; }
```

**Исходный код (`PageCrowler.tsx`)**:
```tsx
import React, {useState} from 'react';
import {PageCrowlerProps} from './api';
import styles from './PageCrowler.module.css';

export const PageCrowler: React.FC<PageCrowlerProps> = ({pages, outerStyles="", height, width}) => {const keys = Object.keys(pages);
  const [activeKey, setActiveKey] = useState(keys[0] || '');
  const externalStyles={height, width}

  return (
    <div className={`${styles.crowler} ${outerStyles||""}`} style={externalStyles}>
      <div className={styles.tabs}>
        {keys.map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${key === activeKey ? styles["tab--active"] : ''}`}
            onClick={() => setActiveKey(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {pages[activeKey]}
      </div>
    </div>
  );};

```

### 📈 Виджет `CPlot`

**Классификация**: Виджет / OptPage / widgets / ControlledPlot / CPlot

**Файлы**:
- `CPlot.tsx`
- `CPlot.module.css`
- `combinePlots.ts`
- `api.ts`
- `index.ts`

**API**:
```ts
interface CPlotI {
  height?: string;
  width?: string;
  outerStyles?: string;
}
```

**Принцип работы**:
`CPlot` отображает два plotly-графика (IDVD и IDVG), объединяя данные из глобального состояния `jotai`. Графики строятся с помощью `combinePlots`, визуализируются через `react-plotly.js`. В случае отсутствия данных отображаются подсказки и загрузчик.

**Источники данных**:
- `graphStateAtom` (глобальный atom с данными графиков)
- `isGraphFetchingAtom` (флаг загрузки)

**Обработка ошибок**:
- Если поле `model.message` задано — отображается alert
- Под каждым графиком выводится ошибка `err: XX%`

**CSS (`CPlot.module.css`)**:
```css
.cplot { display: flex; flex-wrap: wrap; overflow: auto; }
.cplot__item { min-width: 600px; height: 100%; position: relative; }
.cplot__error { position: absolute; bottom: 8px; right: 12px; background: rgba(255,0,0,0.8); color: white; }
```

**Исходный код (`CPlot.tsx`)**:
```tsx
import React, {useEffect} from "react";
import {useAtomValue} from "jotai";
import {graphStateAtom, isGraphFetchingAtom} from "../sharedState";
import Plot from "react-plotly.js";
import styles from "./CPlot.module.css";
import {CPlotI} from "./api";
import {CenteredContainer} from "../../../../../../core/Wrappers";
import {Loader, parentStyles} from "../../../../../../core/UI/Loader";
import {combinePlots} from "./combinePlots";

export const CPlot: React.FC<CPlotI> = ({height, width, outerStyles}) => {const additionalStyles = {height,
    width,
    position: "relative" as const,};

  const {measurements, model, name} = useAtomValue(graphStateAtom);
  const isFetching = useAtomValue(isGraphFetchingAtom);

  const combined = combinePlots({measurements, model, name});
  const message = model?.message

  useEffect(() => {if (message) alert(message);}, [message]);

  if (!combined) {return (
      <CenteredContainer {...additionalStyles}  height="99%" overflow="hidden" flexDirection="column">
        {isFetching ? (
          <Loader visible />
        ) : (
          <>
            <span>Запустите шаг</span>
            <span>или</span>
            <span>проведите моделирование</span>
          </>
        )}
      </CenteredContainer>
    );}

  const plots = [
    {key: "IDVD",
      data: combined.pointIDVD.data,
      layout: combined.pointIDVD.layout,
      error: combined.errIDVD ?? 0,},
    {key: "IDVG",
      data: combined.pointIDVG.data,
      layout: combined.pointIDVG.layout,
      error: combined.errIDVG ?? 0,},
  ];

  return (
    <div
      style={additionalStyles}
      className={`${styles.cplot} ${outerStyles || ""} ${parentStyles}`}
    >
      {plots.map(({key, data, layout, error}) => (
        <div key={key} className={styles.cplot__item}>
          <Plot
            data={data}
            layout={layout}
            className={styles.cplot__plot}
            config={{responsive: true, displaylogo: false}}
            useResizeHandler
            style={{width: "100%", height: "100%"}}
          />
          <span className={styles.cplot__error}>
            err: {Math.round(error * 100) / 100}%
          </span>
        </div>
      ))}
      <Loader visible={isFetching} />
    </div>
  );};
```
### ⚙️ Виджет `ModelButton`

**Классификация**: Виджет / OptPage / widgets / ControlledPlot / ModelButton

**Файлы**:
- `ModelBtn.tsx`
- `api.ts`
- `index.ts`

**API**:
```ts
interface ModelButtonProps {
  config: {
    host: string;
    endpoint: string;
    queryParams?: Record<string, string | number>;
  };
}
```

**Принцип работы**:
Компонент отображает кнопку, которая по нажатию запускает асинхронное моделирование. Использует `fetchPlot` для получения данных с сервера. Хранит состояние загрузки через jotai (`isGraphFetchingAtom`) и обновляет атомы модели и графика.

**Логика**:
- Кнопка блокируется при загрузке (`disabled={isFetching}`)
- В случае ошибки устанавливает `model: null` и выводит alert
- Результат моделирования сохраняется в `updateModelAtom`

**Исходный код (`ModelBtn.tsx`)**:
```tsx
import React from "react";
import {useAtom, useSetAtom} from "jotai";
import {Button} from "../../../../../../../core/UI";
import {isGraphFetchingAtom,
  PlotDataSchema,
  updateModelAtom,
  graphStateAtom,} from "../../sharedState";
import {ModelButtonProps} from "./api";
import {fetchPlot} from "../sharedWebAPI";

export const ModelButton: React.FC<ModelButtonProps> = ({config}) => {const {host, endpoint, queryParams} = config;
  const setModel = useSetAtom(updateModelAtom);
  const setGraphState = useSetAtom(graphStateAtom);
  const [isFetching, setFetching] = useAtom(isGraphFetchingAtom);

  const handleClick = async () => {setFetching(true);
    try {const result = await fetchPlot({host,
        endpoint,
        schema: PlotDataSchema,
        queryParams,});
      setModel(result);} catch {setGraphState((prev) => ({...prev, model: null}));
      alert("Ошибка при моделировании. Проверьте параметры.");} finally {setFetching(false);}};

  return (
    <Button clickHandler={handleClick} disabled={isFetching}>
      Смоделировать
    </Button>
  );};
```
### 🧩 Виджет `SelectElemBtn` + `SelectElemForm`

**Классификация**: Виджет / OptPage / widgets / ControlledPlot / SelectElem

**Файлы**:
- `SelectElemBtn.tsx`
- `SelectElemForm.tsx`
- `SelectElemForm.module.css`
- `api.ts`
- `index.ts`

**API `SelectElemBtn`**:
```ts
interface CPlotUploadBtnProps {
  config: {
    host: string;
    listEndpoint: string;
    plotEndpoint: string;
  };
}
```

**API `SelectElemForm`**: props идентичны `config` из `SelectElemBtn`

**Принцип работы**:
- `SelectElemBtn` — оборачивает `SelectElemForm` во всплывающее окно `PagePopUpWindow`
- `SelectElemForm` — форма с выпадающим списком элементов и кнопкой "Выбрать"
- После выбора элемента отправляется запрос на сервер, и данные сохраняются в атом состояния

**CSS (`SelectElemForm.module.css`)**:
```css
.form { display: flex; flex-direction: column; justify-content: space-between; gap: 1em; align-items: center; }
.message { text-align: center; font-size: 1rem; }
.select-wrapper { width: 100%; max-width: 300px; height: 150px; overflow-y: auto }
.select { width: 100%; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

**Исходный код `SelectElemBtn.tsx`**:
```tsx
import {PagePopUpWindow} from "../../../../../../../core/widgets";
import {CPlotUploadBtnProps} from "./api";
import {SelectElemForm} from "./SelectElemForm";
import {PagePopUpWindowI} from "../../../../../../../core/widgets";
import {useAtomValue} from "jotai";
import {isGraphFetchingAtom} from "../../sharedState";

export const SelectElemBtn: React.FC<CPlotUploadBtnProps> = ({config}) => {const isFetching = useAtomValue(isGraphFetchingAtom)
  const popupConfig: PagePopUpWindowI["config"] = {openBtn: {children: "Выбрать элемент", disabled:isFetching},
    closeBtn: {children: "", styleModification: ["crossBtn"]}};

  return (
    <PagePopUpWindow config={popupConfig}>
      < SelectElemForm config={config} />
    </PagePopUpWindow>
  );};

```

**Исходный код `SelectElemForm.tsx`**:
```tsx
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button} from "../../../../../../../core/UI";
import {useSetAtom} from "jotai";
import {PlotDataSchema,
  isGraphFetchingAtom,
  updateMeasurementsAtom,} from "../../sharedState";
import {fetchPlot} from "../sharedWebAPI";
import styles from "./SelectElemForm.module.css";
import {SelectList} from "../../../../../../../core/widgets/SelectList/SelectList";

interface SelectFormValues {selectedElement: string;}

export const SelectElemForm: React.FC<{config: {host: string;
    listEndpoint: string;
    plotEndpoint: string;};}> = ({config}) => {const {host, listEndpoint, plotEndpoint} = config;
  const [options, setOptions] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);
  const {register,
    handleSubmit,
    reset,
    setValue, // 👈 добавь} = useForm<SelectFormValues>();

  const setFetching = useSetAtom(isGraphFetchingAtom);
  const updateMeasurements = useSetAtom(updateMeasurementsAtom);

  useEffect(() => {const loadOptions = async () => {try {setLoadError(false);
        const response = await fetch(`${host}/${listEndpoint}`);
        const data = await response.json();
        setOptions(data);
        if (data.length > 0) {reset({selectedElement: data[0]});}} catch {setLoadError(true);}};

    loadOptions();}, []);

  const onSubmit = async ({selectedElement}: SelectFormValues) => {setFetching(true);
    try {const result = await fetchPlot({host,
        endpoint: plotEndpoint,
        schema: PlotDataSchema,
        queryParams: {name: selectedElement},});

      updateMeasurements({name: selectedElement, plot: result});} catch {alert("Ошибка загрузки графика измерений");} finally {setFetching(false);}};

  if (loadError) {return (
      <div className={styles.form}>
        <span className={styles.message}>
          Ошибка<br />Проверьте интернет-соединение
        </span>
      </div>
    );}

  if (options.length === 0) {return (
      <div className={styles.form}>
        <span className={styles.message}>Загрузите измерения</span>
      </div>
    );}

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <SelectList<SelectFormValues>
        options={options}
        register={register}
        setValue={setValue} // 👈 передаём
        name="selectedElement"
        width="auto"
        defaultValue={options[0]}
      />
      <Button type="submit">Выбрать</Button>
    </form>
  );};
```
### 🌐 Подмодуль `WebAPI`

**Классификация**: Подмодуль / OptPage / webAPI

**Файлы**:
- `WebAPI.ts`
- `index.ts`

**Содержит**:
- `getInteractiveServers(host: string): Promise<string[]>` — запрашивает список серверов
- `getPlotByInteractiveServer(...)` — загружает данные для построения графика по ID сервера
- `getElemListForUpload(host: string): Promise<string[]>` — получает список моделей для отображения в `SelectElemForm`
- `getPlotByElem(...)` — запрашивает графики по выбранному элементу
- `runModel(...)` — запускает расчёт модели на сервере

**Принцип работы**:
Предоставляет абстракции над `fetch`, централизуя работу с серверными эндпоинтами, используемыми на странице `OptPage`.

**Особенности**:
- Все функции используют `URLSearchParams` или `FormData` для формирования тела запроса.
- Ответы возвращаются в формате `Promise<ServerPlotData | ServerModelData | string[]>`

### 🧠 Состояние страницы `OptPage`

**Классификация**: Хранилище состояния / OptPage

**Файлы**:
- `state.ts`

**Atoms**:
- `interactiveModelAtom` — состояние активной модели (результаты выполнения)
- `graphStateAtom` — данные графиков, полученные от сервера (IDVD, IDVG)
- `isGraphFetchingAtom` — индикатор текущей загрузки графиков

**Принцип работы**:
Все атомы реализованы через `jotai`. Используются множеством виджетов для синхронного доступа к данным. Состояние контролирует прогресс моделирования, отображение графиков, повторную загрузку и очистку данных.

**Примеры использования**:
- `ModelBtn` обновляет `interactiveModelAtom` и `graphStateAtom`
- `CPlot` читает `graphStateAtom` и `isGraphFetchingAtom`

### 📋 Компонент `ISL` (Interactive Step List)

**Классификация**: Виджет / OptPage / widgets / InteractiveServerList / ISL

**Файлы**:
- `ISL.tsx`
- `ISL.module.css`
- `api.ts`
- `index.ts`

**Назначение**:
Компонент отображает интерактивный список шагов с возможностью:
- выбора элемента (шаг процесса)
- добавления нового шага
- удаления выбранного шага
- изменения порядка (вверх/вниз)

**API (props)**:
```ts
interface ISLProps {
  config: {
    host: string;
    endpoints: {
      getList: string;
      addEP: string;
      deleteEP: string;
      changeOrderEP: string;
    };
  };
  syncFunc: (id: string | null) => void;
  outerStyles?: string;
  height?: string;
  width?: string;
}
```

**Стили (`ISL.module.css`)**:
```css
.ISL__elem--selected { background-color: #d0e7ff; outline-color: #3390ff; }
.ISL__elem--no-padding { padding: 0; }
```

**Ключевые моменты**:
- Использует `jotai` для хранения текущего состояния (`ISLStateAtom`)
- Отображает список, валидируя данные по Zod-схеме
- Реализованы мутации: `add`, `delete`, `reorder` через `react-query`
- Использует `InputField` для ввода новых шагов

**Ошибки**:
- `ServerStatusError` → сообщение: "Сервер временно недоступен"
- `BadNetwork` → "Проверьте интернет-соединение"

**Исходный код (`ISL.tsx`)**:
```tsx
import React, {useEffect, useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {ISLProps} from './api';
import {ISLStateAtom} from '../sharedState/ISLState';
import {useAtom} from 'jotai';
import styles from './ISL.module.css';
import {InputField} from '../../../../../../core/UI';
import {CenteredContainer} from '../../../../../../core/Wrappers';
import {z} from 'zod';
import {GETRequest, JSONResponseConverter, validateWithZodSchema} from '../../../../../../core/webAPI';
import {Loader, parentStyles} from '../../../../../../core/UI/Loader';
import {BadNetwork, ServerStatusError} from '../../../../../../core/webAPI/Requests/errors';

type Step = {name: string;
  index: number;
  id: string;};

const StepSchema = z.object({name: z.string(),
  index: z.number(),
  id: z.string(),});

const StepsListSchema = z.array(StepSchema);
export const ISL: React.FC<ISLProps> = ({config, syncFunc, outerStyles = null, height, width}) => {const externalStyles = {height, width}
  const {endpoints} = config;
  const [currentState, setState] = useAtom(ISLStateAtom);
  const [selected, setSelected] = useState<Step | null>(null);

  const queryClient = useQueryClient();

  // 1. Получаем список шагов
  const {data: steps = [],
    isError,
    isLoading,
    error} = useQuery<Step[]>({queryKey: ['steps'],
    queryFn: async () => {const res = await GETRequest(config.host, config.endpoints.getList);
      if (!res.isSuccessful) throw res.data;

      const json = await JSONResponseConverter(res.data);
      if (!json.isSuccessful) throw json.data;

      const validated = validateWithZodSchema({data: json.data,
        schema: StepsListSchema,});

      if (!validated.isSuccessful) throw validated.data;
      return validated.data;},
    staleTime: Infinity,});

  // 2. Удаление шага
  const deleteMutation = useMutation({mutationFn: async (id: string) => {const url = new URL(endpoints.deleteEP, config.host);  
      url.searchParams.set('id', id);
      await fetch(url.toString(), {method: 'DELETE'});},
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['steps']});},
    onError: ()=>alert("Произошла непредвиденная ошибка, повторите операцию позже")});

  // 3. Изменение порядка
  const changeOrderMutation = useMutation({mutationFn: async (updatedSteps: Step[]) => {await fetch(new URL(endpoints.changeOrderEP, config.host), {method: 'POST', // ✅ PATCH, как теперь принято
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({steps:updatedSteps}),});},
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['steps']});},
    onError: ()=>alert("Произошла непредвиденная ошибка, повторите операцию позже")});

  // 4. Добавление шага
  const addMutation = useMutation({mutationFn: async (newStep: {name: string; index: number}) => {await fetch(new URL(endpoints.addEP, config.host), {method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newStep),});},
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['steps']});},
    onError: ()=>alert("Произошла непредвиденная ошибка, повторите операцию позже")});

  const handleSelect = (step: Step) => {setSelected(step);};

  useEffect(() => {if (!selected) {if (currentState==="editing"){return}
      setState('stable');} else if (currentState === 'deleting') {deleteMutation.mutate(selected.id);
      setSelected(null);
      setState('stable');} else if (currentState === 'moovingUp') {const currentStep = steps.find(s => s.id === selected.id);
      if (!currentStep) return;

      const currentIndex = currentStep.index;
      const targetStep = steps.find(s => s.index === currentIndex - 1);

      if (targetStep) {const updated = [
          {...targetStep, index: currentIndex},
          {...currentStep, index: currentIndex - 1},
        ];
        changeOrderMutation.mutate(updated);}

      setState('stable');} else if (currentState === 'moovingDown') {const currentStep = steps.find(s => s.id === selected.id);
        if (!currentStep) return;

        const currentIndex = currentStep.index;
        const targetStep = steps.find(s => s.index === currentIndex + 1);

        if (targetStep) {const updated = [
            {...currentStep, index: currentIndex + 1},
            {...targetStep, index: currentIndex},
          ];
          changeOrderMutation.mutate(updated);}

    setState('stable');}}, [currentState]);

  useEffect(() => {syncFunc(selected?.id ?? null);}, [selected]);

  // Добавление через поле
  const handleAdd = (val: string) => {if(steps.length===0){if(!val.trim()){setState("stable")
        return}
      else{addMutation.mutate(
            {name: val.trim(), index: 0},
            {onSuccess: () => setState('stable')}
          );}}else{if(!val.trim()){setState('stable');
        return;}
      else if(!selected){addMutation.mutate(
          {name: val.trim(), index: 0},
          {onSuccess: () => setState('stable')}
        );}
      else{addMutation.mutate(
          {name: val.trim(), index: selected.index + 1},
          {onSuccess: () => setState('stable')}
        );}}};
  if (isLoading) {return (
      <div className={parentStyles} style={{height:'100%' ,width:"100%"}}>
        <Loader visible={true}/>
      </div>
    );}

  if (isError) {let message = ""
    if (error instanceof ServerStatusError) {message = "Сервер временно недоступен";} else if (error instanceof BadNetwork) {message = "Проверьте интернет-соединение";} else {message = "Попробуйте позже";}
    return(
      <CenteredContainer flexDirection="column" width="100%" height="100%">
        <span>Ошибка загрузки</span>
        {message}
      </CenteredContainer>
    )}


  const inputFieldConfig = currentState==="editing"
    ? {placeholder: 'Введите название нового шага',
        enterHandler: handleAdd,
        blurHandler: handleAdd,
        outerStyles: styles["ISL__input"],}
    : undefined;
  if (steps.length === 0 && currentState !== "editing") {return (
      <CenteredContainer {...externalStyles} width='100%'>
        <span>Добавьте шаг</span>
      </CenteredContainer>
    );}

  return (
    <ul style={externalStyles} className={`${styles.ISL} ${outerStyles}`}>
      {!selected&&currentState==="editing"?
        <li className={`${styles["ISL__elem"]} ${styles["ISL__elem--no-padding"]}`}>
          <InputField {...inputFieldConfig} />
        </li>
        :
        null}
      {[...steps].sort((a, b) => a.index - b.index).map((step) => (
        <React.Fragment key={step.id}>
          <li
            title={step.name}
            className={`${styles["ISL__elem"]} ${selected?.id === step.id ? styles['ISL__elem--selected'] : ''}`}
            onClick={() => handleSelect(step)}
          >
            {step.name}
          </li>

          {currentState === 'editing' && selected?.id === step.id && inputFieldConfig && (
            <li className={`${styles["ISL__elem"]} ${styles["ISL__elem--no-padding"]}`}>
              <InputField {...inputFieldConfig} />
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );};
```
### 🎛 Подмодуль `ISLBtns`

**Классификация**: Подмодуль / OptPage / widgets / InteractiveServerList / ISL / ISLControls / ISLBtns

**Файлы**:
- `ISLBtns.tsx`
- `index.ts`

**Содержит**:
- `AddButton` — переход в режим добавления
- `DeleteButton` — переход в режим удаления
- `MoveUpButton` — переход в режим подъёма элемента
- `MoveDownButton` — переход в режим опускания

**Принцип работы**:
Каждая кнопка управляет глобальным состоянием `ISLStateAtom` через `jotai`. Кнопки активны только при состоянии `"stable"`, иначе блокируются (`disabled`).

**Типичный механизм**:
```tsx
<Button disabled={state!=="stable"} clickHandler={() => setState("deleting")}>
  Удалить
</Button>
```

**Исходный код (`ISLBtns.tsx`)**:
```tsx
import React from 'react';
import {useAtom} from 'jotai';
import {ISLStateAtom} from '../sharedState/ISLState';
import {Button} from '../../../../../../core/UI'; 

export const AddButton: React.FC = () => {const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button disabled={state!=="stable"} clickHandler={() => setState("editing")}>
      Добавить
    </Button>
  );};

export const DeleteButton: React.FC = () => {const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button disabled={state!=="stable"} clickHandler={() => setState("deleting")}>
      Удалить
    </Button>
  );};

export const MoveUpButton: React.FC = () => {const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button  disabled={state!=="stable"} clickHandler={() => setState("moovingUp")}>
      Поднять
    </Button>
  );};

export const MoveDownButton: React.FC = () => {const [state, setState] = useAtom(ISLStateAtom);
  return (
    <Button  disabled={state!=="stable"} clickHandler={() => setState("moovingDown")}>
      Опустить
    </Button>
  );};
```
### 🧠 Состояние `ISLState`

**Классификация**: Состояние / OptPage / widgets / InteractiveServerList / ISL / ISLState.ts

**Файл**:
- `ISLState.ts`

**Содержит атомы состояния**:
- `ISLSelectedElemIdAtom` — ID выбранного шага
- `ISLStateAtom` — режим текущего взаимодействия: `stable`, `adding`, `deleting`, `reordering-up`, `reordering-down`
- `ISLMessageAtom` — пользовательское сообщение (например, ошибка или результат)
- `ISLItemsAtom` — текущий список шагов (в виде массива объектов)

**Типы и константы**:
- `ISLStateType = "stable" | "adding" | "deleting" | "reordering-up" | "reordering-down"`
- `defaultISLState`: все атомы сброшены в начальное состояние

**Принцип работы**:
- Управление всеми атомами осуществляется через `jotai`
- Используется компонентами `ISL`, `ISLBtns`, `ISLControls`
- Центральная точка синхронизации между UI и серверными изменениями

**Особенности**:
- Модель разделяет UI-состояние и содержимое списка
- Обеспечивает реактивное отображение и корректное поведение в разных режимах

### 📑 Компонент `StepsCharactForm`

**Классификация**: Подмодуль / OptPage / widgets / InteractiveServerForm / Forms / CharactForm

**Файлы**:
- `CharactForm.tsx`
- `CharactForm.module.css`
- `schema.ts`
- `context.ts`
- `api.ts`
- `index.ts`

**API (CharactFormProps)**:
```ts
interface CharactFormProps {
  height?: string;
  width?: string;
  outerStyles?: string | null;
}
```

**Принцип работы**:
- Использует `useISFContext` для получения `StepsCharactFormContext`, содержащего `register`, `formSubmit`, `data`
- Рендерит набор `<fieldset>` с параметрами, где `data` — это объект, содержащий блоки параметров
- Поддерживает checkbox-флаг `"checked"` и числовые поля в каждом блоке

**Стили (`CharactForm.module.css`)**:
- `.form` — контейнер формы (вертикальный флекс)
- `.form__inputPart` — обёртка всех fieldset (горизонтальный wrap)
- `.form__fieldset` — один блок параметров (группа input'ов)
- `.form__legend` — название группы параметров
- `.form__input-group` — один input с label

**Особенности**:
- Используется динамическое построение формы на основе ключей `data`
- Все значения приводятся к числу (`valueAsNumber: true`)
- Высота и ширина передаются внешне через пропсы

**Исходный код (`CharactForm.tsx`)**:
```tsx
import styles from "./CharactForm.module.css";
import {useISFContext} from "../../context";
import {StepsCharactFormContext} from "./context";
import type {Path} from "react-hook-form";
import type {StepsCharactSchemaType} from "./schema";
import {CharactFormProps} from "./api";


export const StepsCharactForm: React.FC<CharactFormProps> = ({outerStyles = null,
  height,
  width,}) => {const ctx = useISFContext(StepsCharactFormContext);
  if (!ctx) return null;

  const {register, formSubmit, data} = ctx;
  const externalStyles = {height, width};

  return (
    <form
      style={externalStyles}
      onSubmit={formSubmit}
      className={`${styles["form"]} ${outerStyles || ""}`}
    >
      <div className={styles["form__inputPart"]}>
        {Object.keys(data).map((name) => {const block = data[name as keyof StepsCharactSchemaType];

          return (
            <fieldset key={name} className={styles["form__fieldset"]}>
              <legend className={styles["form__legend"]}>{name}</legend>

              <label>
                <input
                  type="checkbox"
                  {...register(`${name}.checked` as Path<StepsCharactSchemaType>)}
                />
                Активно
              </label>

              {Object.entries(block)
                .filter(([key]) => key !== "checked")
                .map(([key]) => {const path = `${name}.${key}` as Path<StepsCharactSchemaType>;
                  return (
                    <div key={key} className={styles["form__input-group"]}>
                      <label>{key}: </label>
                      <input
                        type="number"
                        step="any"
                        {...register(path, {valueAsNumber: true})}
                      />
                    </div>
                  );})}
            </fieldset>
          );})}
      </div>
    </form>
  );};
```
### 📋 Компонент `ParamsForm`

**Классификация**: Подмодуль / OptPage / widgets / InteractiveServerForm / Forms / ParamsForm

**Файлы**:
- `ParamsForm.tsx`
- `ParamsForm.module.css`
- `context.ts`
- `schema.ts`
- `api.ts`
- `index.ts`

**API (`ParamsFormProps`)**:
```ts
interface ParamsFormProps {
  outerStyles?: string | null;
  height: `${number}px` | `${number}%` | "auto";
  width: `${number}px` | `${number}%` | "auto";
  variant: "glob" | "local";
}
```

**Контекст**:
```ts
export const GlobalParamsFormContext = createISFContext<GlobalParamType>();
export const LocalParamsFormContext = createISFContext<LocalParamType>();
```

**Схемы данных (`schema.ts`)**:
```ts
GlobalParamSchema: {
  value: number;
  min: number;
  max: number;
}

LocalParamSchema: {
  checked: boolean;
  value: number;
  min: number;
  max: number;
}
```

**Принцип работы**:
- Форма параметров, отображающая таблицу с возможностью редактирования значений, фильтрации и отправки
- Вариант `glob` (глобальные параметры) не включает флаг `checked`
- Вариант `local` добавляет checkbox `checked` для выбора параметров

**Особенности реализации**:
- Использует `useISFContext` для получения контекста (данные, методы `register`, `reset`, `formSubmit`)
- Автоматически фильтрует параметры по введённой строке
- Отображает заголовок таблицы и строки параметров, каждая строка редактируема
- `valueAsNumber: true` для всех числовых полей

**CSS (`ParamsForm.module.css`)**:
- `.form`, `.form__searchbar`, `.form__row`, `.form__cell`, `.form__save-button` и др.
- Вёрстка таблицей, адаптивность, автообрезка, sticky-заголовок

**Типичные элементы**:
- `input[type=number]` с `step="any"`
- `checkbox` только в `local`-режиме

**Форма оборачивается в**: `<form onSubmit={formSubmit} ... />`

**Зависимости**: `react-hook-form`, `jotai`, `zod`

**Выглядит как таблица с возможностью поиска, редактирования и сохранения**.

**Исходный код `StopForm.tsx`:**
```tsx
import styles from "./stopForm.module.css";
import { useISFContext } from "../../childIndex";
import { StopFormContext } from "./context";
import { StopFormProps } from "./api";

export const StopForm: React.FC<StopFormProps> = ({
  outerStyles = null,
  height,
  width,
}) => {
  const ctx = useISFContext(StopFormContext);
  if (!ctx) return null;

  const {register, formSubmit} = ctx;

  const externalStyles = {height, width};

  return (
    <form
      style={externalStyles}
      className={`${styles["form"]} ${outerStyles || ""}`}
      onSubmit={formSubmit}
    >
        <div className={styles["form__fieldset"]}>
          <div className={styles["form__input-group"]}>
            <label>Число итераций(n): </label>
            <input type="number" {...register("iterNum", {valueAsNumber: true})} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>Отн ошибка(%):</label>
            <input type="number" min={0} max={100} step="any" {...register("relMesErr", {valueAsNumber: true})} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>Абс ошибка(n):</label>
            <input type="number" step="any" {...register("absMesErr", {valueAsNumber: true})} />
          </div>

          <div className={styles["form__input-group"]}>
            <label>&#916; параметра(%):</label>
            <input type="number" min={0} max={100} step="any" {...register("paramDelt", {valueAsNumber: true})} />
          </div>
        </div>
    </form>
  );
};
```

## 🧾 Forms-модуль `Forms`

**Классификация**: Подмодуль / OptPage / widgets / InteractiveServerForm / Forms

**Назначение**:
Содержит формы редактирования параметров и условий моделирования, использующие общий шаблон контекста и схему валидации.

**Экспортируемые формы**:
- `StopForm` — управление критериями остановки
- `StepsCharactForm` — выбор активных характеристик шагов
- `ParamsForm` — таблица параметров, глобальных и локальных

**Общий API через `index.ts`**:
```ts
// StopForm
export { StopForm, StopSchema, StopFormContext } from "./StopForm"
export type { StopFormProps, StopFormValues } from "./StopForm"

// CharactForm
export { StepsCharactForm, StepsCharactSchema, StepsCharactFormContext } from "./CharactForm"
export type { CharactFormProps, StepsCharactSchemaType } from "./CharactForm"

// ParamsForm
export { ParamsForm, GlobalParamSchema, LocalParamSchema, GlobalParamsFormContext, LocalParamsFormContext } from "./ParamForm"
export type { ParamsFormProps, GlobalParamType, LocalParamType } from "./ParamForm"
```

**Принцип организации**:
Каждая форма:
- использует `zod`-схемы валидации
- получает props для управления размерами и стилями
- использует `createISFContext()` из `childIndex` для передачи данных через контекст
- управляется через `react-hook-form`

**Контексты позволяют**:
- получать доступ к `data`, `register`, `formSubmit`, `reset`
- использовать общий шаблон работы с формами

### 🧩 Компонент `ISF<T>` (Interactive Server Form)

**Классификация**: Контейнер / OptPage / widgets / InteractiveServerForm / ISF

**Файлы**:
- `ISF.tsx`
- `api.ts` — интерфейс `ISFProps`
- `context.ts` — универсальный `createISFContext` и хук `useISFContext`
- `SubmitButton.tsx` — кнопка отправки формы

---

**Назначение**:
Компонент `ISF` является универсальным обёрточным контейнером для серверных форм:
- Загружает начальные данные с сервера (GET)
- Отправляет обновлённые данные на сервер (POST)
- Использует `zod`-схему для валидации
- Оборачивает форму в `context.Provider`, через который передаются `data`, `register`, `formSubmit`, `reset`, `isLoading`

---

**API (`ISFProps<T>`)**:
```ts
interface ISFProps<T extends FieldValues> {
  queryParams: Record<string, string> | null;
  formName: string;
  schema: z.ZodSchema<T>;
  context: React.Context<ISFContextType<T> | null>;
  config: {
    host: string;
    endpoints: {
      get: string;
      post: string;
    };
  };
  children: React.ReactNode | React.ReactNode[];
  width: string;
  height: string;
}
```

---

**Контекст (`ISFContextType<T>`)**:
```ts
interface ISFContextType<T extends FieldValues> {
  data: T;
  formSubmit: () => void;
  register: UseFormReturn<T>["register"];
  reset: UseFormReturn<T>["reset"];
  isLoading: boolean;
}
```

Создаётся через:
```ts
const MyContext = createISFContext<MySchemaType>();
const value = useISFContext(MyContext);
```

---

**Ключевые особенности:**
- Работает с `react-hook-form` и `@tanstack/react-query`
- Использует `GETRequest`, `validateWithZodSchema`, `JSONResponseConverter` из `core/webAPI`
- Поддерживает `queryParams` для GET/POST
- Показывает `<Loader />` при загрузке
- Обрабатывает ошибки (`BadNetwork`, `ServerStatusError` и fallback)

---

**Кнопка отправки (`SubmitButton.tsx`)**:
```tsx
export const SubmitButton = <T extends FieldValues>({ context }: SubmitButtonProps<T>) => {
  const ctx = useContext(context);
  if (!ctx) return null;

  return (
    <Button
      styleModification={ctx.isLoading ? ["btn--white_n_blue", "btn--white-loading"] : ["btn--white_n_blue"]}
      disabled={ctx.isLoading}
      clickHandler={ctx.formSubmit}
    >
      Сохранить
    </Button>
  );
};
```

---

**Пример использования:**
```tsx
<ISF
  formName="stop-form"
  queryParams={id: "123"}
  schema={StopSchema}
  context={StopFormContext}
  config={host: "/api",
    endpoints: { get: "stop", post: "stop" },}
  height="100%"
  width="100%"
>
  <StopForm />
  <SubmitButton context={StopFormContext} />
</ISF>
```

---

**Поддерживает инкапсуляцию всей бизнес-логики формы.**

## 🧭 Страница `OptPage`

**Классификация**: Страница / OptPage

**Файлы:**
- `OptPage.tsx` — основной компонент
- `OptPage.module.css` — стили
- `index.ts` — экспорт `OptPage`

---

### 🧩 Общий принцип работы:

`OptPage` — это главная страница интерфейса оптимизации. Она собирает все виджеты и формы в единую структуру при помощи компонента `GridLayout`.

Использует следующие модули:
- **ISL** — список шагов (с добавлением, удалением, сменой порядка)
- **PageCrowler** — переключение между вкладками:
  - "Характеристики" → `StepsCharactForm`
  - "Условия остановки" → `StopForm`
  - "Локальные параметры" → `ParamsForm (variant="local")`
- **Popup** с глобальными параметрами (`ParamsForm` с `variant="glob"`)
- **Plot** через `CPlot`
- **Кнопки управления**: `RunStepButton`, `ModelButton`, `SelectElemBtn`, `Download`

---

### 🧱 Структура разметки:
Используется `GridLayout` с сеткой `3x2`:
- **Колонка 1:** `ISL`
- **Колонка 2:** Панель кнопок управления
- **Колонка 3:**
  - Верх: `PageCrowler`
  - Низ: `CPlot`

---

### ⚙️ Конфигурации форм:
Каждая форма строится по универсальному паттерну `ISF`:
```tsx
<ISF {...formConfig}>
  <AFC>
    <[FormComponent] />
    <SubmitButton />
  </AFC>
</ISF>
```

Формы:
- `StopForm` → `steps/stopcond`
- `StepsCharactForm` → `steps/characteristics`
- `ParamsForm (local)` → `steps/params`
- `ParamsForm (glob)` → `ParamTable`, через `PagePopUpWindow`

---

### 💡 Особенности:
- Поддерживает выбор активного шага `selectedId`
- Все формы работают через `react-query` + `zod` схемы
- API адреса централизованы через `BASE_URL`
- Вспомогательные стили: `optimization__btnsList`, `optimization__grid-item`

---

### 📎 Пример API схем:

```ts
config: {
  host: "http://127.0.0.1:8010",
  endpoints: {
    get: "steps/characteristics",
    post: "steps/characteristics",
  },
}
```

---

**Вывод:** `OptPage` является центральной страницей, интегрирующей все компоненты модуля оптимизации. Она управляет состоянием, конфигурацией форм и API, предоставляя пользователю полный интерфейс работы с шагами модели.