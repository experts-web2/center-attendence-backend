import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRoleController } from './userRole.controller';
import { userRoleService } from './userRole.service';
import { userRoles, userRolesSchema } from './userRoles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: userRoles.name, schema: userRolesSchema },
    ]),
  ],
  controllers: [UserRoleController],
  providers: [userRoleService],
})
export class UserRoleModule {}
