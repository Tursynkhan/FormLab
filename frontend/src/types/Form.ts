export type FormPages = {
  isEdit?: boolean;
  isView?: boolean;
};
export type FormDetail = {
  _id?: Readonly<string>;
  title: string;
  sections: FormSection[];
};

export type FormSection = {
  _id?: Readonly<string>;
  title?: string;
  description?: string;
  fields: FormField[];
};

export type FormField = {
  _id?: Readonly<string>;
  title?: string;
  fieldType: FormType;
  description?: string;
  response?: string | string[];
  otherReason?: string;
  options?: string[];
  other?: boolean;
  rules: FormRules;
};

export type FormType =
  | "checkbox"
  | "dropdown"
  | "radio"
  | "textarea"
  | "input"
  | "date"
  | "file"
  | "texteditor"
  | "slider"
  | "rating";

export type FormRules = {
  required?: { value?: boolean; message?: string };
  pattern?: { value?: RegExp | string; message?: string };
  minLength?: { value?: number; message?: string };
  maxLength?: { value?: number; message?: string };
  min?: { value?: string; message?: string };
  max?: { value?: string; message?: string };
};

