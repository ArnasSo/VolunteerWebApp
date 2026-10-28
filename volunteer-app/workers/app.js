import { createRequestHandler } from "react-router";

export default {
  fetch(request, env, ctx) {
    return createRequestHandler(
      () => import("virtual:react-router/server-build"),
      import.meta.env.MODE
    )(request, {
      cloudflare: { env, ctx },
    });
  },
};