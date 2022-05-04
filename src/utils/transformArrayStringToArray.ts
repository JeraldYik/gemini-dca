// arrayString of format e.g. [0,1,2]
const transformArrayStringToArray = (arrayString: string): string[] => {
  const arrayStringWithoutSquareBrackets = arrayString.slice(
    1,
    arrayString.length - 1
  );
  return arrayStringWithoutSquareBrackets.split(",");
};

export default transformArrayStringToArray;
