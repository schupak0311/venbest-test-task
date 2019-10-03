import commandLineArgs from 'command-line-args';

const optionDefinitions = [{ name: 'pub', type: Number }, { name: 'sub', type: Number }];

const options = commandLineArgs(optionDefinitions);
const { pub, sub } = options;

export { pub, sub };
