export const useIsDebug = () => {
  return useState<boolean>("is-debug", () => true);
};
