import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory'
import { CaslService } from './casl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleDocument, RoleSchema } from './role.schema';
@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
    providers: [CaslAbilityFactory, CaslService],
    exports: [CaslAbilityFactory,CaslService],
})
export class CaslModule {}
