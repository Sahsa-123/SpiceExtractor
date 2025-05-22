interface stepsCharactField {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

export interface stepsCharactFormValues {
  IDVD: stepsCharactField;
  IDVG: stepsCharactField;
}

export interface stepsCharactFormProps {
  stepId: string;
}
