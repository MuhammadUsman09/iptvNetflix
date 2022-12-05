import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import {Action} from './userRoles';
import {User} from '../modules/user/user.schema';
import {CaslService} from './casl.service';

export type Subjects = any;

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private caslService: CaslService) {}
  async createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);
    let caslPermissions=[];
    if (user.role=="ADMIN") {
      can(Action.Manage, 'all'); // read-write access to everything
      caslPermissions.push({action:Action.Manage,subject:'all'})
    } else {
      //const dbPermissions = [{action:'Read',subject:'User'},{action:'Delete',subject:'Cat'},]
      const dbPermissions = await this.caslService.findAllPermissionsOfUser(user);
    let caslPermissions = dbPermissions.permissions.map(p => ({
      action: Action[p.action],
      subject: p.subject,
    }));

    //can(Action.Update, Article, { authorId: user.id });
    //cannot(Action.Delete, Article, { isPublished: true });

   
    }

    return new Ability<[Action, Subjects]>(caslPermissions);
   
  }
}