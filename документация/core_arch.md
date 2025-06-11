# Архитектура ядра (core)

### **📦 Модуль `Errors`**

#### `errors.ts`

Содержит класс:

```ts
export class schemaDismatch extends Error {
  clientMessage: string[];

  constructor(message: string) {
    super(`dismatch of schemas: ${message}`);
    this.name = "schemaDismatch";
    this.clientMessage = [
      "Возникли непредвиденные технические неполадки"
    ];
  }
}
```

**Назначение**: используется при ошибках `zod.parse()`, когда схема не соответствует данным от сервера. Позволяет отлавливать и централизованно обрабатывать ошибки валидации.

**Особенности**:
- Наследует `Error`
- Вводит дополнительное поле `clientMessage` — сообщение для пользователя
- Именуется как `schemaDismatch` (в lowercase — потенциальная точка стиля)

#### `index.ts`

```ts
export { schemaDismatch } from "./errors";
```

**Назначение**: точка экспорта модуля, используется для импортов `from 'core/Errors'`.


### **🔘 UI-компонент `Button`**

#### `Button.tsx`

Реализация переиспользуемой кнопки:

```tsx
export const Button: React.FC<btnProps> = ({
  clickHandler = null, 
  children = null, 
  styleModification = [], 
  type = "button", 
  disabled = false,
  outerStyles = null
}) => {
  const BASICCLASS = "btn";
  const className = classNameConverter(styles, styleModification, BASICCLASS) + (outerStyles || "");

  const handleClick = (e) => {
    if (clickHandler) clickHandler(e); 
  };

  return (
    <button disabled={disabled} type={type} onClick={handleClick} className={className}>
      {children ? <span className="btn__text">{children}</span> : null}
    </button>
  );
};
```

**Особенности**:
- `clickHandler` — внешний обработчик события
- `styleModification: string[]` — список модификаторов из CSS-модуля
- `outerStyles: string | null` — дополнительный внешний класс
- Оборачивает контент в `span`, если `children` переданы

**Назначение**: универсальная кнопка с возможностью передачи стилей и модификаторов. Используется везде, где необходима базовая интерактивная кнопка без зависимости от конкретного контекста.

---

#### `Button.module.css`

Содержит стили:
- `.btn` — базовый стиль
- `.btn--active`, `.btn--white_n_blue`, `.btn--white-loading`, `.btn--black-loading` — модификаторы
- `.flat-bottom`, `.crossBtn` — для визуальных вариаций
- Анимация загрузки точками — через `@keyframes dots-loading`

**Примеры модификаторов**:
- `btn--white_n_blue`: кнопка с синим фоном
- `btn--white-loading`: белая кнопка с анимированными точками
- `flat-bottom`: без нижнего радиуса
- `crossBtn`: кнопка-крест с иконкой


### **☑️ UI-компонент `UFCheckbox`**

#### `UFCheckbox.tsx`

```tsx
export const UFCheckbox: React.FC<UFCheckboxI> = ({
    id,
    name,
    value,
    text,
    register,
    registerOptions=null,
    outerStyles=null,
}) => {
    const registerReturn = registerOptions ? register(name, registerOptions) : register(name);
    return (
        <div className={`${styles.checkbox} ${outerStyles || ""}`}>
            <input type="checkbox" value={value} {...registerReturn} id={id}/>
            <label className={styles.label} htmlFor={id}>{text}</label>
        </div>
    );
};
```

**Назначение**: переиспользуемый чекбокс, совместимый с `react-hook-form`. Используется для ввода булевых значений, с возможностью стилизации.

**Особенности**:
- Поддержка внешнего класса (`outerStyles`)
- Совместим с `register` и `registerOptions` из `react-hook-form`
- Лейбл и инпут связаны через `htmlFor`

---

#### `Checkbox.module.css`

```css
.checkbox > * {
    cursor: pointer;
}
```

Минимальный стиль для удобного взаимодействия с чекбоксом. Применяется курсор `pointer` ко всем вложенным элементам блока `.checkbox`.



### **⌨️ UI-компонент `InputField`**

#### `InputField.tsx`

```tsx
export const InputField: React.FC<InputFieldProps> = ({
  enterHandler = () => {},
  blurHandler = () => {},
  styleModification = [],
  outerStyles = null,
  placeholder = "",
  disabled = false,
  defaultValue = "",
  type = "text"
}) => {
  const BASICCLASS = "input";
  const className = classNameConverter(styles, styleModification, BASICCLASS) + (outerStyles || "");

  const [value, setValue] = useState(defaultValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      enterHandler(value.trim());
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      blurHandler(value.trim());
    }
  };

  return (
    <input
      type={type}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
};
```

**Назначение**: обёртка над `<input>`, расширенная возможностями обработки `Enter` и `blur`, с поддержкой кастомных стилей и модификаторов.

**Особенности**:
- Автообработка `Enter` и `Blur` событий
- Поддержка `disabled`, `placeholder`, `defaultValue`, `type`
- Использует `classNameConverter` для генерации класса

---

#### `InputField.module.css`

```css
.input {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.input:disabled {
  background-color: #f5f5f5;
  color: #aaa;
}
```

Базовая стилизация поля ввода с поддержкой `disabled`-состояния.



### **⏳ UI-компонент `Loader`**

#### `Loader.tsx`

```tsx
export const Loader: React.FC<LoaderI> = ({ visible }) => {
  return (
    <div className={`${styles.loaderOverlay} ${visible ? styles.visible : ""}`}>
      <div className={styles.loader}></div>
    </div>
  );
};
```

**Назначение**: Индикатор загрузки, отображаемый как полупрозрачный оверлей с анимацией.

**Особенности**:
- При `visible=true` накладывается поверх родителя
- Обязательно использовать стиль `loader_parent` у оборачивающего контейнера
- Визуализируется анимированная многоточечная загрузка `...`

---

#### `Loader.module.css`

```css
.loader_parent {
  position: relative;
}

.loaderOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128, 128, 128, 0.5);
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.loaderOverlay.visible {
  opacity: 1;
  visibility: visible;
}

.loader {
  width: fit-content;
  font-weight: bold;
  font-family: monospace;
  clip-path: inset(0 3ch 0 0);
  animation: l4 1s steps(4) infinite;
  color: white;
  font-size: 1.2rem;
}

.loader:before {
  content: "...";
}

@keyframes l4 {
  to {
    clip-path: inset(0 -1ch 0 0);
  }
}
```

**Подсказка**: используйте `className={parentStyles}` в обёртке, чтобы корректно отобразить поверх содержимого.


### **🧩 Утилита `classNameConverter`**

#### `classNameConverter.ts`

```ts
export function classNameConverter(
  styles: { [key: string]: string },
  mods: string[],
  basicClass: string
): string {
  let className = styles[basicClass] + " ";

  mods.forEach((mod) => {
    if (styles[`${basicClass}--${mod}`]) {
      className += styles[`${basicClass}--${mod}`] + " ";
    }
  });

  return className;
}
```

**Назначение**: Упрощает применение BEM-модификаторов к CSS-модулям.

**Принцип работы**:
- `basicClass` — базовое имя класса, например, `btn`
- `mods` — список модификаторов, например, `["white", "loading"]`
- Вернёт строку вида: `btn btn--white btn--loading` (если такие ключи есть в объекте `styles`)

**Пример**:
```ts
classNameConverter(styles, ["white", "loading"], "btn");
// → "btn btn--white btn--loading"
```

**Преимущества**:
- Убирает необходимость ручного конкатенирования классов
- Работает с любыми модулями стилей, где BEM используется как шаблон


### **📦 UI / `index.ts`**

Централизованный экспорт компонентов из модуля UI:

```ts
export * from "./Button";
export * from "./UFCheckbox";
export * from "./InputField";
export * from "./Loader";
```

**Назначение**: 
Обеспечивает удобный импорт всех базовых UI-компонентов из одной точки, например:

```ts
import { Button, Loader } from "core/UI";
```

**Преимущества**:
- Чистый импорт
- Упрощение автодополнения и рефакторинга
- Повышение модульности и читаемости


---

### **🌐 Модуль `webAPI` / `index.ts`**

Централизует экспорт всех подмодулей и утилит, используемых для взаимодействия с внешними API:

```ts
export * from "./Requests";
export * from "./Requests/errors";
export * from "./Requests/types";
export * from "./Requests/validators";
```

**Назначение**: 
Позволяет подключать весь функционал WebAPI с одного уровня:

```ts
import { GETRequest, ServerStatusError } from "core/webAPI";
```

**Подмодули**:
- `Requests` — базовые HTTP-запросы (GET, POST и др.)
- `errors` — кастомные классы ошибок сети и сервера
- `types` — типы ответов от серверов
- `validators` — функции валидации данных и схемы



---

### **🚨 Подмодуль `Requests/errors.ts`**

Содержит кастомные классы ошибок, используемые в модуле `webAPI`.

```ts
export class BadNetwork extends Error {}
export class ServerStatusError extends Error {}
export class InvalidContentTypeError extends Error {}
export class InvalidJSONError extends Error {}
export class SchemaValidationError extends Error {}
```

**Назначение**:
- `BadNetwork` — отсутствие соединения
- `ServerStatusError` — код ответа от сервера вне диапазона 2xx
- `InvalidContentTypeError` — неверный `Content-Type` в ответе
- `InvalidJSONError` — ошибка парсинга JSON
- `SchemaValidationError` — не прошёл валидацию по Zod-схеме

---

### **🧰 `JSONResponseConverter.ts`**

Функция безопасного преобразования `Response` в JSON с типами.

```ts
export async function JSONResponseConverter(response: Response): Promise<WrappedResponse<unknown>> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return { isSuccessful: false, data: new InvalidContentTypeError() };
  }

  try {
    const data = await response.json();
    return { isSuccessful: true, data };
  } catch {
    return { isSuccessful: false, data: new InvalidJSONError() };
  }
}
```

**Преимущества**:
- Не выбрасывает исключения
- Унифицированный формат `WrappedResponse<T>`
- Используется как шаг после `fetch`, перед валидацией схемой



---

### **📡 `GETRequest.ts`**

Унифицированная обёртка над HTTP GET-запросом с предобработкой ошибок:

```ts
export async function GETRequest(host: string, endpoint: string): Promise<WrappedResponse<Response>> {
  try {
    const url = new URL(endpoint, host);
    const response = await fetch(url.toString());

    if (!response.ok) {
      return { isSuccessful: false, data: new ServerStatusError(response.status) };
    }

    return { isSuccessful: true, data: response };
  } catch {
    return { isSuccessful: false, data: new BadNetwork() };
  }
}
```

**Особенности**:
- Использует встроенный `fetch`
- Оборачивает ответ в формат `WrappedResponse<Response>`
- Генерирует ошибки из `Requests/errors.ts` вместо выбрасывания исключений

**Назначение**:
- Стандартизация работы с `GET`
- Безопасное выполнение и отлов всех типов сетевых сбоев



---

### **🧪 `validateWithZodSchema.ts`**

Функция обёртка над Zod для безопасной валидации данных от сервера:

```ts
export function validateWithZodSchema<T>({
  data,
  schema,
}: {
  data: unknown;
  schema: ZodSchema<T>;
}): WrappedResponse<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { isSuccessful: true, data: result.data };
  }

  return { isSuccessful: false, data: new SchemaValidationError(result.error) };
}
```

**Назначение**:
- Проверка структуры и типов приходящего JSON
- Возвращает типизированный результат без выбрасывания исключений

**Преимущества**:
- Безопасная альтернатива `schema.parse()`
- Поддержка формата `WrappedResponse<T>`
- Интеграция с `zod` и системой ошибок

**Типовой сценарий**:
1. Получить ответ с помощью `fetch`
2. Преобразовать через `JSONResponseConverter`
3. Проверить `validateWithZodSchema`



---

### **🧩 Модуль `widgets` / `index.ts`**

Централизованный экспорт всех переиспользуемых виджетов:

```ts
export * from "./SelectList";
```

**Назначение**:
- Предоставляет точку входа для общего доступа к виджетам
- Упрощает импорт в других модулях приложения

**Типичный пример использования**:
```ts
import { SelectList } from "core/widgets";
```

**Текущий экспортируемый подмодуль**:
- `SelectList` — настраиваемый дропдаун с интеграцией в формы (см. ниже)



---

### **🪟 Компонент `PagePopUpWindow`**

**Классификация**: Виджет / core / widgets / PagePopUpWindow

**Файлы**:
- `PagePopUpWindow.tsx`
- `PagePopUpWindow.module.css`
- `api.ts`
- `index.ts`

**Назначение**:
Интерактивный pop-up компонент, отображающий дочерний контент по нажатию кнопки.

**API (`PagePopUpWindowI`)**:
```ts
interface PagePopUpWindowI {
  config: {
    openBtn: Pick<btnProps, "styleModification" | "children" | "disabled">;
    closeBtn: Pick<btnProps, "styleModification" | "children">;
  };
  outerStyles?: string | null;
  children: React.ReactElement;
}
```

**Описание**:
- Отображает `openBtn`, который при нажатии показывает окно
- Использует обёртку `PopUpTemplate` для модального слоя
- Кнопка `closeBtn` внутри окна закрывает его
- Стили управляют видимостью через класс `.visible`

**Визуальное поведение**:
- `.popUpBtn` изначально скрыт (opacity: 0)
- Добавление `.visible` делает кнопку доступной для взаимодействия

**Пример использования**:
```tsx
<PagePopUpWindow
  config={{
    openBtn: { children: "Открыть", styleModification: "primary" },
    closeBtn: { children: "Закрыть", styleModification: "danger" }
  }}
>
  <MyForm />
</PagePopUpWindow>
```


---

### **🔽 Компонент `SelectList`**

**Файлы**:
- `SelectList.tsx`
- `SelectList.module.css`

**Описание**:
Компонент выпадающего списка (`select`) с ручным управлением стилями и открытием/закрытием. Поддерживает интеграцию с `react-hook-form`.

**Props (`SelectListProps<T>`)**:
```ts
{
  options: string[];
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  outerStyles?: string;
  width: string; // например, "auto" | "200px"
}
```

**Особенности**:
- Управление шириной на основе содержимого
- Скрытый список используется для измерения ширины самой длинной опции
- Обработка кликов вне компонента для закрытия
- Интеграция с `react-hook-form` (регистрация поля и обновление значения)

**Пример использования**:
```tsx
<SelectList<MyFormValues>
  options={["один", "два", "три"]}
  register={register}
  setValue={setValue}
  name="myField"
  width="auto"
/>
```
