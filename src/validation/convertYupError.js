import { SubmissionError } from 'redux-form';
import reduce from 'lodash.reduce';
import dot from 'dot-object';

const convertSingle = (err) => {
  const flatten = {
    [err.path]: [ err.message ],
  };
  const unflattened = dot.object(flatten);

  return new SubmissionError(unflattened);
};

const convertMultiBase = (err) => {
  return reduce(err.inner, (result, value) => {
    const inners = convertMultiBase(value);

    return [
      ...result,
      {
        path: value.path,
        message: value.message,
      },
      ...(inners) ? inners : [],
    ];
  }, {
  });
};

const convertMulti = (err) => {
  const flatten = convertMultiBase(err);
  const grouped = reduce(flatten, (result, value) => {
    if(result[value.path] == null) {
      return {
        ...result,
        [value.path]: [value.message],
      };
    }
    result[value.path].push(value.message);

    return result;
  }, {});
  const unflattened = dot.object(grouped);

  return new SubmissionError(unflattened);
};


const convertYupError = (err) => {
  return (err.path == null) ? convertMulti(err) : convertSingle(err);
};

export default convertYupError;