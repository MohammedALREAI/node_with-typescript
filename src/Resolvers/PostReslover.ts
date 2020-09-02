import { IContext } from "./../Types/types";
import {
  Resolver,
  Query,
  Args,
  Int,
  Arg,
  Mutation,
  Ctx,
} from "type-graphql";
import { Post } from "src/Entities/Posts";



@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: IContext): Promise<Post[]> {
    return ctx.em.find(Post, {});
  }
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: IContext
  ): Promise<Post | null> {
    return ctx.em.findOne(Post, { id });
  }
  @Mutation(() => Post, { nullable: false })
  async createPost(
    @Arg("id", { nullable: false }) id: number,
    @Arg("title", { nullable: true }) title: string,
    @Ctx() ctx: IContext
  ): Promise<Post | null> {
    const isfound = await ctx.em.findOne(Post, { id });
    if (isfound) {
      throw new Error("the post found ");
    }

    const newPost = await ctx.em.create(Post, { title });
    await ctx.em.persistAndFlush(Post);
    return newPost;
  }

  //deletePost
  @Mutation(() => Boolean, { nullable: false })
  async deletePost(
    @Arg("id", { nullable: false }) id: number,
    @Ctx() ctx: IContext
  ): Promise<boolean> {
    const isfound = await ctx.em.findOne(Post, { id });
    if (!isfound) {
      throw new Error("the post  Not found ");
    }

    await ctx.em.nativeDelete(Post, { id });
    return true;
  }
  //updatePost

  @Mutation(() => Post, { nullable: false })
  async updatePost(
    @Arg("id", { nullable: false }) id: number,
    @Arg("title", { nullable: false }) title: string,
    @Ctx() ctx: IContext
  ): Promise<Post | null> {
    const isfound = await ctx.em.findOne(Post, { id });
    if (!isfound) {
      throw new Error("the post  Not found ");
    }

    await ctx.em.nativeDelete(Post, { id });
    return true;
  }
}
