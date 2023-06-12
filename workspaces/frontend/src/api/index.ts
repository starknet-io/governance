import { Router, createCors, json } from "itty-router";

// now let's create a router (note the lack of "new")
export const apiRouter = Router({ base: "/api" });

const { preflight, corsify } = createCors({
  origins: ["http://127.0.0.1:1234", "http://localhost:1234"],
});

apiRouter.all("*", preflight);

apiRouter.get(
  "/hello",
  async (req, event: WorkerGlobalScopeEventMap["fetch"]) => {
    return corsify(
      json({
        message: "Hello World!",
      })
    );
  }
);
