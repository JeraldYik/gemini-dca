// this method only parses counter max to hours
const counterToTimeElapsed = (counter: number) =>
  new Date(counter * 10000).toISOString().slice(11, 19);

export default counterToTimeElapsed;
