import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import type { CreateCategoryDto } from "../dtos/create-category.dto";
import type { FilterCategoryDto } from "../dtos/filter-category.dto";
import type { UpdateCategoryDto } from "../dtos/update-category.dto";
import { CategoryService } from "../services/category.service";

@Controller("categories")
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @ApiOperation({ summary: "Lista categorias com filtros e paginação" })
  @ApiQuery({ name: "name", required: false, type: String })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["INCOME", "EXPENSE", "INVESTMENT"],
  })
  @ApiQuery({
    name: "init",
    required: false,
    type: String,
    example: "0",
    description: "Número da página",
  })
  @ApiQuery({ name: "limit", required: false, type: String, example: "10" })
  @ApiResponse({
    status: 200,
    description:
      "Lista paginada de categorias com total de registros, contadores de categorias ativas e inativas",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              type: {
                type: "string",
                enum: ["INCOME", "EXPENSE", "INVESTMENT"],
              },
              color: { type: "string" },
              isActive: { type: "boolean" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
        totalLength: { type: "number", description: "Total de categorias" },
        activeCount: {
          type: "number",
          description: "Total de categorias ativas",
        },
        inactiveCount: {
          type: "number",
          description: "Total de categorias inativas",
        },
      },
    },
  })
  findAll(@Query() filter: FilterCategoryDto) {
    return this.service.findAll(filter);
  }

  @Post()
  @ApiOperation({ summary: "Cria uma nova categoria" })
  @ApiBody({
    description: "Dados para criar uma nova categoria",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Salário",
          description: "Nome da categoria",
        },
        type: {
          type: "string",
          enum: ["INCOME", "EXPENSE", "INVESTMENT"],
          example: "INCOME",
          description: "Tipo da categoria",
        },
        color: {
          type: "string",
          example: "#123456",
          description: "Cor da categoria",
        },
      },
      required: ["name", "type"],
    },
  })
  @ApiResponse({ status: 201, description: "Categoria criada com sucesso" })
  @ApiResponse({
    status: 409,
    description: "Categoria com mesmo nome e tipo já existe",
  })
  create(@Body() data: CreateCategoryDto) {
    return this.service.create(data);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza uma categoria existente" })
  @ApiBody({
    description: "Dados para atualizar uma categoria existente",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Salário Atualizado",
          description: "Nome da categoria (opcional)",
        },
        type: {
          type: "string",
          enum: ["INCOME", "EXPENSE", "INVESTMENT"],
          example: "INCOME",
          description: "Tipo da categoria (opcional)",
        },
        color: {
          type: "string",
          example: "#123456",
          description: "Cor da categoria (opcional)",
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Categoria atualizada com sucesso" })
  update(@Param("id") id: string, @Body() data: UpdateCategoryDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove uma categoria" })
  @ApiResponse({ status: 200, description: "Categoria removida com sucesso" })
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
