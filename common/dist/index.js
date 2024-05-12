"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.createPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string(),
    name: zod_1.z.string(),
    password: zod_1.z.string().min(8),
});
exports.signinInput = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.createPostInput = zod_1.z.object({
    title: zod_1.z.string().refine((value) => value.trim() !== '', {
        message: 'Title cannot be empty',
        path: ['title'],
    }),
    content: zod_1.z.string().refine((value) => value.trim() !== '', {
        message: 'Content cannot be empty',
        path: ['content'],
    }),
    imagePreview: zod_1.z.string().url(),
    tags: zod_1.z.array(zod_1.z.string())
});
exports.updatePostInput = zod_1.z.object({
    title: zod_1.z.string().optional().refine((value) => !value || value.trim() !== '', {
        message: 'Title cannot be empty',
        path: ['title'],
    }),
    content: zod_1.z.string().optional().refine((value) => !value || value.trim() !== '', {
        message: 'Content cannot be empty',
        path: ['content'],
    }),
    imagePreview: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
