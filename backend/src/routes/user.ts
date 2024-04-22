import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { z } from "zod";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const signUpBody = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
});

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signUpBody.safeParse(body);

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

const signInBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signInBody.safeParse(body);

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
        email: body.email,
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
