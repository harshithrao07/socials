import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./routes/user";
import { postRouter } from "./routes/blog";
import { protectedRouter } from "./routes/protected";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use(cors());

app.get("/", (c) => {
  return c.text("Hello, World!");
});

app.route("/api/v1/user", userRouter);
app.route("/api/v1/posts", postRouter);
app.route("/api/v1/auth", protectedRouter);


export default app;
