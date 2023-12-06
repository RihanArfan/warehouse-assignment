export const useIsAuthenticated = () => {
  return useState<boolean>("is-authenticated", () => false);
};
