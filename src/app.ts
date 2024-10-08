import "express-async-errors";

import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";
import { createAdminRouter } from "./routes/create-admin";
import { deleteAdminRouter } from "./routes/delete-admin";
import { errorHandler } from "./middlewares/error-handler";
import express from "express";
import { getAdminRouter } from "./routes/get-admin";
import { getAdminsRouter } from "./routes/get-admins";
import { updateAdminRouter } from "./routes/update-admin";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  }),
);

app.use(getAdminsRouter);
app.use(getAdminRouter);
app.use(createAdminRouter);
app.use(deleteAdminRouter);
app.use(updateAdminRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
