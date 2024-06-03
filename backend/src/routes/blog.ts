import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

postRouter.get("/", async (c) => {
  try {
    const page = parseInt(c.req.query("page") as string, 10) || 1;
    const perPage = 9;
    const offset = (page - 1) * perPage;

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        include: { author: true },
        skip: offset,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count(),
    ]);

    if (!posts || posts.length === 0) {
      return c.json({ message: "No posts found" });
    }

    c.header("X-Total-Count", totalCount.toString());
    c.header("Access-Control-Expose-headers", "X-Total-Count");

    return c.json(posts); // Return the array of posts directly
  } catch (error) {
    console.error("Error fetching posts:", error);
    c.status(500);
    return c.json({ message: `Error fetching posts` });
  }
});

postRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
        savedBy: true
      },
    });

    return c.json(post);
  } catch (error) {
    c.status(422);
    return c.json({ message: `Error fetching post with id ${id}` });
  }
});