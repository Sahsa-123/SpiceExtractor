import { useState, useRef, useEffect } from "react";
import styles from "./SelectList.module.css";
import {
  UseFormRegister,
  FieldValues,
  Path,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";

export interface SelectListProps<T extends FieldValues> {
  options: string[];
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  outerStyles?: string;
  width: string; // можно "auto" или "200", "300px" и т.п.
}

export function SelectList<T extends FieldValues>({
  options,
  register,
  setValue,
  name,
  defaultValue = "",
  disabled = false,
  placeholder = "Выберите...",
  outerStyles = "",
  width,
}: SelectListProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hiddenListRef = useRef<HTMLUListElement>(null);
  const [calculatedWidth, setCalculatedWidth] = useState<string>("auto");

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    setValue(name, value as PathValue<T, typeof name>);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (hiddenListRef.current) {
      const widest = Array.from(hiddenListRef.current.children).reduce(
        (max, el) => {
          const width = (el as HTMLElement).offsetWidth;
          return Math.max(max, width);
        },
        0
      );
      const withPadding = widest + 15;

      if (width === "auto") {
        setCalculatedWidth(`${withPadding}px`);
      } else {
        const parsed = parseInt(width.toString(), 10);
        const maxWidth = Math.max(parsed, withPadding);
        setCalculatedWidth(`${maxWidth}px`);
      }
    }
  }, [options, width]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.selectWrapper} ${outerStyles || ""}`}
      style={{ width: calculatedWidth }}
    >
      <input type="hidden" value={selected} {...register(name)} />
      <div
        className={`${styles.selectDisplay} ${
          isOpen ? styles.open : ""
        } ${disabled ? styles.disabled : ""}`}
        onClick={toggleOpen}
        title={selected || placeholder}
      >
        {selected || placeholder}
      </div>

      <ul
        className={`${styles.optionsList} ${!isOpen ? styles.hiddenList : ""}`}
      >
        {options.map((option, idx) => (
          <li
            key={idx}
            className={`${styles.option} ${
              option === selected ? styles["option--selected"] : ""
            }`}
            onClick={() => handleSelect(option)}
            title={option}
          >
            {option}
          </li>
        ))}
      </ul>

      {/* Скрытый список для измерения ширины */}
      <ul ref={hiddenListRef} className={styles.hiddenOptions}>
        {options.map((option, idx) => (
          <li key={idx} className={styles.option}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
