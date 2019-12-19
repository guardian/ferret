export const getPageUri = (): string => {
  return window.location.href.replace(/\?.*/, "").replace(/#.*/, "");
};
