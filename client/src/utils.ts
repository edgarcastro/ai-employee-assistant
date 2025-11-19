export const formatErrorSocketMessage = (error: Error) => {
  let message = "An unexpected error occurred.";

  if (error.message) {
    const msg = error.message.toLowerCase();

    if (msg.includes("network")) {
      message =
        "Network error: Please check your internet connection and try again.";
    } else if (msg.includes("timeout")) {
      message = "The connection timed out. Please try again later.";
    } else if (msg.includes("unauthorized") || msg.includes("forbidden")) {
      message = "You are not authorized to perform this action.";
    } else if (msg.includes("not found")) {
      message = "The server could not be reached. Please try again later.";
    } else if (
      msg.includes("server error") ||
      msg.includes("internal server")
    ) {
      message = "The server encountered an error. Please try again later.";
    } else if (msg.includes("disconnect")) {
      message = "Connection to the server was lost. Please reconnect.";
    } else {
      message = error.message;
    }
  }

  return message;
};
