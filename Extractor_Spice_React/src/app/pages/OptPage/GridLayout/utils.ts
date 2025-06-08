export const buildColTemplate = (widths?:  [(number|"auto")?, (number|"auto")?, (number|"auto")?]): string => {
  const safe = (widths ?? []).slice(0, 3);
  const filled = [...safe, ...Array(3 - safe.length).fill(1)];
  return filled.map(n => n==="auto"?n:`${n}fr`).join(' ');
};
export const buildRowTemplate = (heights?: [(number|"auto")?, (number|"auto")?, (number|"auto")?]): string => {
  const safe = (heights ?? []).slice(0, 2);
  const filled = [...safe, ...Array(2 - safe.length).fill(1)];
  return filled.map(n => n==="auto"?n:`${n}fr`).join(' ');
};
