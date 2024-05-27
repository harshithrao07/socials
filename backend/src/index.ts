import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  createPostInput,
  signupInput,
  updatePostInput,
} from "harshithrao07-common-app";

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

// Middleware
app.use("/api/v1/auth/*", async (c, next) => {
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

app.post("/api/v1/user/signup", async (c) => {
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

app.post("/api/v1/user/signin", async (c) => {
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

app.get("/api/v1/auth/me", async (c) => {
  try {
    const userId = c.get("userId");

    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        savedPosts: {
          include: {
            author: true,
          },
        },
        followedBy: true,
        following: true,
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

app.get("/api/v1/profile/:id", async (c) => {
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
            author: true,
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

// Post Routes

app.post("/api/v1/auth/posts/upload", async (c) => {
  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);

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

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        imagePreview: body.imagePreview,
        tags: body.tags,
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

app.put("/api/v1/auth/posts", async (c) => {
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

    // Fetch the existing post
    const existingPost = await prisma.post.findUnique({
      where: { id: body.id },
      include: { savedBy: true },
    });

    if (!existingPost) {
      c.status(404);
      return c.json({ message: "Post not found" });
    }

    // Check if the userId is already in the savedBy array
    const isUserSaved = existingPost.savedBy.some(
      (user) => user.id === body.savedBy
    );

    let updatedPost;
    if (isUserSaved) {
      // Disconnect the userId
      updatedPost = await prisma.post.update({
        where: { id: body.id },
        data: {
          title: body.title,
          content: body.content,
          imagePreview: body.imagePreview,
          tags: body.tags,
          savedBy: {
            disconnect: { id: body.savedBy },
          },
        },
      });
    } else {
      // Connect the userId
      updatedPost = await prisma.post.update({
        where: { id: body.id },
        data: {
          title: body.title,
          content: body.content,
          imagePreview: body.imagePreview,
          tags: body.tags,
          savedBy: {
            connect: { id: body.savedBy },
          },
        },
      });
    }

    return c.json({
      id: updatedPost.id,
    });
  } catch (error) {
    c.status(422);
    return c.json({ message: "Error while updating post" });
  }
});

app.put("/api/v1/auth/profile/:id/follow", async (c) => {
  const profileId = c.req.param("id");
  const userId = c.get("userId");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    // Check if the user is already following the profile
    const isFollowing = await prisma.user.findFirst({
      where: {
        id: userId,
        following: {
          some: {
            id: profileId,
          },
        },
      },
    });

    let response;

    if (isFollowing) {
      // If the user is already following, unfollow
      response = await Promise.all([
        prisma.user.update({
          where: {
            id: profileId,
          },
          data: {
            followedBy: {
              disconnect: {
                id: userId,
              },
            },
          },
        }),
        prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            following: {
              disconnect: {
                id: profileId,
              },
            },
          },
        }),
      ]);
    } else {
      // If the user is not following, follow
      response = await Promise.all([
        prisma.user.update({
          where: {
            id: profileId,
          },
          data: {
            followedBy: {
              connect: {
                id: userId,
              },
            },
          },
        }),
        prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            following: {
              connect: {
                id: profileId,
              },
            },
          },
        }),
      ]);
    }

    c.status(200);
    return c.json({ response });
  } catch (error) {
    return c.json({ message: "Could not follow/unfollow the profile" });
  }
});

app.get("/api/v1/posts/:id", async (c) => {
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
      },
    });

    return c.json(post);
  } catch (error) {
    c.status(422);
    return c.json({ message: `Error fetching post with id ${id}` });
  }
});

app.get("/api/v1/posts", async (c) => {
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

export default app;
