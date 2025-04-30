export const isShiftEnter = (event: React.KeyboardEvent) => {
  return event.key === "Enter" && event.shiftKey;
};