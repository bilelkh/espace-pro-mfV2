// A function that keeps trying, "toTry" until it returns true or has
// tried "max" number of times. First retry has a delay of "delay".
// "callback" is called upon success.
export function exponentialBackoff(toTry: () => any, max: number, delay: number, callback: (result?: any) => void) {
  const result = toTry();
  if (result) {
    callback(result);
  } else {
    if (max > 0) {
      setTimeout(() => {
        exponentialBackoff(toTry, --max, delay * 2, callback);
      }, delay);
    } else {
      callback();
    }
  }
}
