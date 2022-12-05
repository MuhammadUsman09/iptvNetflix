import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./model/user.schema";
import { Role, RoleSchema } from "./model/role.schema";
import { COA, COASchema } from "./model/coa.schema";
import { UsersSeeder } from "./seeder/users.seeder";
import { RoleSeeder } from "./seeder/roles.seeder";
import { COASeeder } from "./seeder/coa.seeder";

seeder({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/game-of-thrones"),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Role.name, schema: RoleSchema },{ name: COA.name, schema: COASchema }]),
  ],
}).run([UsersSeeder,RoleSeeder,COASeeder]);