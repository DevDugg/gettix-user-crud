import "express-async-errors";

import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";
import { errorHandler } from "./middlewares/error-handler";
import express from "express";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  }),
);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
