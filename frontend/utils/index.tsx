export const debounce = <T,>(
  fn: (args: T) => void,
  delay: number
): ((args: T) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
