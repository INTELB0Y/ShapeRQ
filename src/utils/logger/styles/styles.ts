import type { iStyles, iSimpleStyles } from "../../../types";
import { baseStyles, sucBaseStyles, errBaseStyles } from "./baseStyles";
// Simple styles
export const simpleStyles: iSimpleStyles = {
  info: `color: #42A5F5; ${baseStyles.font.simply}`,
  success: `color: #66BB6A; ${baseStyles.font.simply}`,
  warn: `color: #FFA726; ${baseStyles.font.simply}`,
  error: `color: #EF5350; ${baseStyles.font.simply}`,
};

// Data styles
export const geckoDataStyles: iStyles = {
  title: `color: ${baseStyles.palette.info}; ${baseStyles.font.title}`,
  message: `color: ${baseStyles.palette.info}; border: 1px solid ${baseStyles.palette.info}; background-color: ${baseStyles.palette.background}; font-style: italic; ${baseStyles.block}`,
};

export const blinkDataStyles: iStyles = {
  title: `color: ${baseStyles.palette.info}; ${baseStyles.font.title}`,
  message: `color: ${baseStyles.palette.info}; font-style: italic; margin-top: 4px`,
};

// Styles for successful requests
export const geckoSuccessStyles: iStyles = {
  title: sucBaseStyles.title,
  message:
    sucBaseStyles.message +
    `border: 1px solid ${baseStyles.palette.success}; background-color: ${baseStyles.palette.background}; ${baseStyles.block}`,
  body:
    sucBaseStyles.body +
    `border: 1px solid ${baseStyles.palette.success}; color: ${baseStyles.palette.success}; ${baseStyles.block} background-color: ${baseStyles.palette.background}; `,
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
