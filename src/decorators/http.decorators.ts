import type { PipeTransform } from '@nestjs/common';
import {
  applyDecorators,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/auth.guard';

import type { RoleType } from '../constants';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
import { CheckPolicies, PoliciesGuard } from '../guards/PoliciesGuard';
import { AppAbility, CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from 'src/casl/userRoles';

export function Auth(
  roles: Action,
  options: string,
): MethodDecorator {

  return applyDecorators(
    UseGuards(JwtAuthGuard,PoliciesGuard),
    CheckPolicies((ability: AppAbility) => ability.can(roles, options)),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }), 
  );
}
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);