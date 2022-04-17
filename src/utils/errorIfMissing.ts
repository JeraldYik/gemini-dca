const errorIfMissing = (name: string, val?: string): never | void => {
  if (val === undefined) {
    throw new Error(`Missing environment variable ${name}`);
  }
};

export default errorIfMissing;
