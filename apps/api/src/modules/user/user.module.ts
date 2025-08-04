import { Module } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./user.repository";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
