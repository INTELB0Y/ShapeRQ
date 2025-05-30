export const baseStyles = {
  font: {
    title: `font-weight: bold; font-size: 16px;`,
    message: `font-size: 12px;`,
    doc: `font-size: 11px;`,
    simply: `font-weight: bold; font-size: 12px`
  },
  palette: {
    error: `#EF5350`,
    success: `#66BB6A`,
    info: `#42A5F5`,
    warn: `#FFA726`,
    background: `#45454d`
  },
  block: `display: block; padding: 3px; border-radius: 3px; margin-top: 5px;`,
};

export const sucBaseStyles = {
  title: `${baseStyles.font.title} color: ${baseStyles.palette.success}`,
  message: `${baseStyles.font.message} color: ${baseStyles.palette.success}; font-weight: bold;`,
  body: `${baseStyles.palette.success} ${baseStyles.font.message}; font-style: italic;`,
};

export const errBaseStyles = {
  title: `color: ${baseStyles.palette.error}; ${baseStyles.font.title}`,
  message: `color: ${baseStyles.palette.error}; ${baseStyles.font.message} font-weight: 400;`,
  doc: baseStyles.font.doc,
};
