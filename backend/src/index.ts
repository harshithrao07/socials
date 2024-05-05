import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { postRouter } from "./routes/post";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

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
})

// User Routes
app.route("/api/v1/user", userRouter);

//post Routes
app.route("/api/v1/post", postRouter);

app.get("/api/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany(); // Use findMany() to get all posts
    if (!posts || posts.length === 0) {
      return c.json({ message: 'No posts found' });
    }
    console.log(posts);
    return c.json(posts); // Return the array of posts directly
  } catch (error) {
    console.error("Error fetching posts:", error);
    c.status(500);
    return c.json({ message: `Error fetching posts` });
  }
});

export default app;
