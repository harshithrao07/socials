import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "harshithrao07-common-app";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({
      message: "Invalid request body. Please provide the required data.",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const passwordArrayBuffer = new TextEncoder().encode(body.password);

    const hash = await crypto.subtle.digest(
      {
        name: "SHA-256",
      },
      passwordArrayBuffer
    );

    const hashedPassword = Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        name: body.name,
        password: hashedPassword,
      },
    });

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({ token });
  } catch (err) {
    c.status(422);
    return c.json({ message: "User already exists" });
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({
      message: "Invalid request body. Please provide the required data.",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      c.status(400);
      return c.json({
        message: "User does not exist",
      });
    }

    const passwordArrayBuffer = new TextEncoder().encode(body.password);

    const hash = await crypto.subtle.digest(
      {
        name: "SHA-256",
      },
      passwordArrayBuffer
    );

    const hashedPassword = Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    if (user.password !== hashedPassword) {
      c.status(403);
      return c.json({
        message: "Invalid Credentials",
      });
    }

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({ token });
  } catch (err) {
    c.status(422);
    return c.json({ message: "Error while signing in" });
  }
});

userRouter.get("/:id", async (c) => {
  const { id } = c.req.param();

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        posts: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
                username: true,
              },
            },
          },
        },
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                email: true,
                name: true,
                username: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                email: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return c.json(user);
  } catch (error) {
    c.status(404);
    return c.json({
      message: "User does not exist",
    });
  }
});
