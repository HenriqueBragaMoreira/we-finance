import { PrismaService } from "@/utils/prisma.service";
import { Module } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { CategoryController } from "./controllers/category.controller";
import { CategoryService } from "./services/category.service";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, PrismaService],
})
export class CategoryModule {}
