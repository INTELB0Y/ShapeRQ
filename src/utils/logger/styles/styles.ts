import type { StylesType, SimpleStylesType } from "../../../types";
import { baseStyles, sucBaseStyles, errBaseStyles } from "./baseStyles";
// Simple styles
export const simpleStyles: SimpleStylesType = {
  info: `color: ${baseStyles.palette.info}; ${baseStyles.font.simply}`,
  warn: `color: ${baseStyles.palette.warn}; ${baseStyles.font.simply}`,
  error: `color: ${baseStyles.palette.error}; ${baseStyles.font.simply}`,
};

// Data styles
export const geckoDataStyles: StylesType = {
  title: `color: ${baseStyles.palette.info}; ${baseStyles.font.title}`,
  message: `color: ${baseStyles.palette.info}; border: 1px solid ${baseStyles.palette.info}; background-color: ${baseStyles.palette.background}; font-style: italic; ${baseStyles.block}`,
};

export const blinkDataStyles: StylesType = {
  title: `color: ${baseStyles.palette.info}; ${baseStyles.font.title}`,
  message: `color: ${baseStyles.palette.info}; font-style: italic; margin-top: 4px`,
};

// Styles for successful requests
export const geckoSuccessStyles: StylesType = {
  title: sucBaseStyles.title,
  message:
    sucBaseStyles.message +
    `border: 1px solid ${baseStyles.palette.success}; background-color: ${baseStyles.palette.background}; ${baseStyles.block}`,
  body:
    sucBaseStyles.body +
    `border: 1px solid ${baseStyles.palette.success}; color: ${baseStyles.palette.success}; ${baseStyles.block} background-color: ${baseStyles.palette.background}; `,
};

export const blinkSuccessStyles: StylesType = {
  title: sucBaseStyles.title,
  message: sucBaseStyles.message,
  body: sucBaseStyles.body,
};

// Error styles
export const geckoErrStyles: StylesType = {
  title: errBaseStyles.title,
  message:
    errBaseStyles.message +
    baseStyles.block +
    `background-color: #714651; border: 1px solid ${baseStyles.palette.error};`,
  doc: errBaseStyles.doc,
};

export const blinkErrStyles: StylesType = {
  title: errBaseStyles.title,
  message: errBaseStyles.message,
  doc:
    errBaseStyles.doc +
    `background-color: #714651; padding: 3px; border-radius: 3px; margin-bottom: 5px`,
};
