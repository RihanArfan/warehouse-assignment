export const useIsUnreadAlerts = () => {
  return useState<boolean>("is-alert-unread", () => false);
};
