export type http = {
  method: string;
  url: string;
  body?: any;
};

export type spec = {
  response: Response;
  method: string;
};

export type iStyles = {
  title: string;
  message: string;
  separator?: string;
  body?: string;
  doc?: string;
};

export type iSimpleStyles = {
  info: string;
  success: string;
  warn: string;
  error: string;
};
