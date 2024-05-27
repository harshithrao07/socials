import { z } from "zod";
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    name: string;
    password: string;
}, {
    email: string;
    username: string;
    name: string;
    password: string;
}>;
export declare type SignupType = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare type SigninType = z.infer<typeof signinInput>;
export declare const createPostInput: z.ZodObject<{
    title: z.ZodEffects<z.ZodString, string, string>;
    content: z.ZodEffects<z.ZodString, string, string>;
    imagePreview: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    imagePreview: string;
    tags: string[];
}, {
    title: string;
    content: string;
    imagePreview: string;
    tags: string[];
}>;
export declare type CreatePostType = z.infer<typeof createPostInput>;
export declare const updatePostInput: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    imagePreview: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    savedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    imagePreview?: string | undefined;
    tags?: string[] | undefined;
    savedBy?: string | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    imagePreview?: string | undefined;
    tags?: string[] | undefined;
    savedBy?: string | undefined;
}>;
export declare type UpdatePostInput = z.infer<typeof updatePostInput>;
