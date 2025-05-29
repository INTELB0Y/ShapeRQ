import type { iStyles, iSimpleStyles } from "../../../types";
import { baseStyles, sucBaseStyles, errBaseStyles } from "./baseStyles";
// Simple styles
export const simpleStyles: iSimpleStyles = {
  info: `color: #42A5F5; font-weight: bold; font-size: 12px`,
  success: `color: #66BB6A; font-weight: bold; font-size: 12px`,
  warn: `color: #FFA726; font-weight: bold; font-size: 12px`,
  error: `color: #EF5350; font-weight: bold; font-size: 12px`,
};

// Data styles
export const geckoDataStyles: iStyles = {
  title: `color: #42A5F5; font-weight: bold; font-size: 16px;`,
  message: `color: #42A5F5; border: 1px solid #42A5F5; display: block; background-color: #45454d; font-style: italic; padding: 3px; border-radius: 3px; margin-top: 4px`,
};

export const blinkDataStyles: iStyles = {
  title: `color: #42A5F5; font-weight: bold; font-size: 16px;`,
  message: `color: #42A5F5; font-style: italic; margin-top: 4px`,
};

// Styles for successful requests
export const geckoSuccessStyles: iStyles = {
  title: sucBaseStyles.title,
  message:
    sucBaseStyles.message +
    `border: 1px solid ${baseStyles.palette.success}; background-color: #45454d; ${baseStyles.block}`,
  body:
    sucBaseStyles.body +
    `border: 1px solid ${baseStyles.palette.success}; color:${baseStyles.palette.success}; ${baseStyles.block} background-color: #45454d; `,
};

export const blinkSuccessStyles: iStyles = {
  title: sucBaseStyles.title,
  message: sucBaseStyles.message,
  body: sucBaseStyles.body,
};

// Error styles
export const geckoErrStyles: iStyles = {
  title: errBaseStyles.title,
  message:
    errBaseStyles.message +
    baseStyles.block +
    `background-color: #714651; border: 1px solid ${baseStyles.palette.error};`,
  doc: errBaseStyles.doc,
};

export const blinkErrStyles: iStyles = {
  title: errBaseStyles.title,
  message: errBaseStyles.message,
  doc:
    errBaseStyles.doc +
    `background-color: #714651; padding: 3px; border-radius: 3px; margin-bottom: 5px`,
};
