import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;
  @Field(() => String)
  @Property()
  title!: string;
  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;
  @Field(() => String)
  @Property({ type: "text",  })
  password!: string;

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
