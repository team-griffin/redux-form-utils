import reduce from 'lodash.reduce';

const createValidationMessage = (namespace, test, values = []) => {
  return JSON.stringify({
    id: `${namespace}.\${path}.${test}`,
    values: reduce(values, (result, value) => {
      return {
        ...result,
        [value]: `\${${value}}`,
      };
    }, {
    }),
  });
};

export default createValidationMessage;