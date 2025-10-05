export const errorHandler = (err, req, res, next) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({
        error: {
          code: err.code || "SERVER_ERROR",
          message: err.message || "Internal server error",
        },
      });
  };
  