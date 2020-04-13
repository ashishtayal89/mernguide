function createLogMiddleware() {
  return () => next => action => {
    if (action.log) {
      console.log(action);
    }
    return next(action);
  };
}

const logger = createLogMiddleware();

export default logger;
