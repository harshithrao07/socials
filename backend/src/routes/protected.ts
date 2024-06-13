import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "harshithrao07-common-app";

export const protectedRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

protectedRouter.use("*", async (c, next) => {
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
    c.set("userId", payload.id as string);
    await next();
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Internal Server Error",
    });
  }
});

protectedRouter.get("/me", async (c) => {
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
            post: {
              include: {
                author: {
                  select: {
                    id: true,
                    email: true,
                    username: true,
                    name: true,
                  }
                },
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
                username: true,
                name: true,
              }
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                posts: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        email: true,
                        username: true,
                        name: true,
                      }
                    },
                  },
                },
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

protectedRouter.post("/post", async (c) => {
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

protectedRouter.put("/post", async (c) => {
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

    const updatedPost = await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags,
        imagePreview: body.imagePreview,
      },
    });

    return c.json({
      id: updatedPost.id,
    });
  } catch (error) {
    c.status(422);
    return c.json({ message: "Error while updating post" });
  }
});

protectedRouter.put("/user/:id/follows", async (c) => {
  const profileId = c.req.param("id");
  const userId = c.get("userId");
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    // Check if the user is already following the profile
    const isFollowing = await prisma.userFollows.findFirst({
      where: {
        followerId: userId,
        followingId: profileId,
      },
    });

    let response;

    if (isFollowing) {
      // If the user is already following, unfollow
      response = await prisma.userFollows.delete({
        where: {
          id: isFollowing.id,
        },
      });
    } else {
      // If the user is not following, follow
      response = await prisma.userFollows.create({
        data: {
          followerId: userId,
          followingId: profileId,
        },
      });
    }
    c.status(200);
    return c.json({ response });
  } catch (error) {
    c.status(422);
    return c.json({ message: "Could not follow/unfollow the profile" });
  }
});

protectedRouter.put("/post/:id/save", async (c) => {
  const postId = c.req.param("id");
  const userId = c.get("userId");

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    // Check if the userId is already in the savedBy array
    const isUserSaved = await prisma.userSavedPost.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    let updatedPost;
    if (isUserSaved) {
      updatedPost = await prisma.userSavedPost.delete({
        where: {
          id: isUserSaved.id,
        },
      });
    } else {
      updatedPost = await prisma.userSavedPost.create({
        data: {
          userId: userId,
          postId: postId,
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
