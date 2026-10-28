import {
  createRequestHandler,
  RouterContextProvider,
} from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  fetch(request, env, ctx) {
    return requestHandler(
      request,
      new RouterContextProvider()
    );
  },
};