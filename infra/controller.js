import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

async function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}
function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error,
    cause: error,
  });
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json({ publicErrorObject });
}

const controller = {
  errorHandles: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};
export default controller;
