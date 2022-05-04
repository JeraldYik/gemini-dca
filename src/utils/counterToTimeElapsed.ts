/**
 * @param externalLoopCounter
 * @param externalLoopInterval in minutes
 * @param internalLoopCounter
 * @param internalLoopInterval in seconds
 * @returns a time string of format HH:MM:SS
 */
const counterToTimeElapsed = (
  externalLoopCounter: number,
  externalLoopInterval: number,
  internalLoopCounter: number,
  internalLoopInterval: number
) =>
  new Date(
    (externalLoopCounter * externalLoopInterval * 60 +
      internalLoopCounter * internalLoopInterval) *
      1000
  )
    .toISOString()
    .slice(11, 19);

export default counterToTimeElapsed;
