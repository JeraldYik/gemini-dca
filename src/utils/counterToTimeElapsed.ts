/**
 * This method only parses counter to hours at maximum
 * @param counter
 * @param interval interval is in seconds
 * @returns
 */
const counterToTimeElapsed = (counter: number, interval: number) =>
  new Date(counter * 1000 * interval).toISOString().slice(11, 19);

export default counterToTimeElapsed;
