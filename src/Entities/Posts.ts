import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;
  @Field(() => String)
  @Property()
  title!: string;
  
  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
