import { User } from "./../Entities/User";
import { IContext } from "./../Types/types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import userError from "../utils/userError";
import argon2 from'argon2'

//create delete-update- search

@InputType()
class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field(() => [Error], { nullable: true })
  field: string
  @Field()
  message: string
}
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field()
  user?: User;
}



@Resolver()
export class UserResolver {
  ///Qusery
  @Query()

  //Mutations
  @Mutation(() => UserResponse)
  async register(
    @Arg("data") data: UsernamePasswordInput,
    @Ctx() {req,em}: IContext
  ): Promise<UserResponse> {

//check validation of usename
if(data.email==="" || data.email.length<=5){
     return {
          errors:[{
               field:"username",
               message:"the email is not good to used it "
          }]
     }
}

    //hased password
    const passwordhased = await argon2.hash(data.password, 10);

//     make validation

    const user = em.create(User, {
      username: data.email,
      password: passwordhased,
    });
    try {
         await ctx.em.persistAndFlush(user);

    } catch (error) {
         userError(`THER ARE SOME THING HAPPNED ${error}`)

    }
return{
     user
}
}


  async login(
    @Arg("options") data: UsernamePasswordInput,
    @Ctx() ctx: IContext
  ): Promise<UserResponse> {
    //steps
    //     check email found
    const userExit = await ctx.em.findOne(User, { email: data.email });

    if (!userExit) {
      {
           return{

               errors:[{
               field:"username or email",
                message:`the username ${data.email} is not foun in the application`
           ]}
      }
    }
//     check password
const matchpass=await bycript.verify(data.password,userExit.password);
if(!matchpass){
     return {
          errors:[{
               field:"password issue",
               message:" the password not match with with password "
          }]
     }
}

    return {user:userExit};
  }
}
