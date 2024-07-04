export const getProperty = (token, prop) => {
  return JSON.parse(atob(token.split(".")[1]))[prop];
};
