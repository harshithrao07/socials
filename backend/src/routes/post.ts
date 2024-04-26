import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "harshithrao07-common-app";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Middleware
postRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      c.status(403);
      return c.json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(403);
      return c.json({
        message: "Unauthorized",
      });
    }
    c.set("userId", payload.id);
    await next();
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Internal Server Error",
    });
  }
});

// Post Routes

postRouter.post("/upload", async (c) => {
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({
      message: "Invalid request body. Please provide the required data.",
    });
  }

  const authorId = c.get("userId");
  console.log(authorId);

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    return c.json({
      id: post.id,
    });
  } catch (error) {
    c.status(422);
    return c.json({ message: `Error while posting post` });
  }
});

postRouter.put("/update", async (c) => {
  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({
      message: "Invalid request body. Please provide the required data.",
    });
  }

  const authorId = c.get("userId");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const updatedpost = await prisma.post.update({
      where: {
        id: body.id,
        authorId: authorId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      id: updatedpost.id,
    });
  } catch (error) {
    c.status(422);
    return c.json({ message: "Error while updating post" });
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
    });

    return c.json(post);
  } catch (error) {
    c.status(422);
    return c.json({ message: `Error fetching post with id ${id}` });
  }
});

postRouter.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({});

    return c.json(posts);
  } catch (error) {
    c.status(422);
    return c.json({ message: `Error fetching posts` });
  }
});
