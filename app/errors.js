exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.savingError = message => {
  return {
    statusCode: 503,
    message
  };
};

exports.badRequest = message => {
  return {
    statusCode: 400,
    message
  };
};
