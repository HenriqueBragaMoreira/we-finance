import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@thallesp/nestjs-better-auth";
import type { FilterUserDto } from "../dtos/filter-user.dto";
import type { GetUserByIdDto } from "../dtos/get-user-by-id.dto";
import { UserService } from "../services/user.service";

@ApiTags("users")
@Controller("users")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @ApiOperation({
    summary: "Lista todos os usuários da aplicação com filtros e paginação",
    description:
      "Retorna uma lista paginada de todos os usuários cadastrados na aplicação",
  })
  @ApiQuery({
    name: "name",
    required: false,
    type: String,
    description: "Filtrar por nome do usuário",
  })
  @ApiQuery({
    name: "email",
    required: false,
    type: String,
    description: "Filtrar por email do usuário",
  })
  @ApiQuery({
    name: "emailVerified",
    required: false,
    type: String,
    description: "Filtrar por status de verificação de email (true/false)",
    example: "true",
  })
  @ApiQuery({
    name: "init",
    required: false,
    type: String,
    example: "0",
    description: "Número da página",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: String,
    example: "10",
    description: "Número máximo de registros por página",
  })
  @ApiResponse({
    status: 200,
    description: "Lista paginada de usuários com total de registros",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "user-uuid-123" },
              name: { type: "string", example: "João Silva" },
              email: { type: "string", example: "joao@email.com" },
              emailVerified: { type: "boolean", example: true },
              image: {
                type: "string",
                example: "https://avatar.url",
                nullable: true,
              },
              createdAt: {
                type: "string",
                example: "2025-08-04T10:00:00.000Z",
              },
              updatedAt: {
                type: "string",
                example: "2025-08-04T10:00:00.000Z",
              },
            },
          },
        },
        totalLength: { type: "number", example: 150 },
      },
    },
  })
  findAll(@Query() filter: FilterUserDto) {
    return this.service.findAll(filter);
  }

  @Get("by-id")
  @ApiOperation({
    summary: "Busca um usuário específico por ID",
    description:
      "Retorna os dados de um usuário específico incluindo estatísticas de transações",
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: String,
    description: "ID único do usuário (obrigatório)",
    example: "user-uuid-123",
  })
  @ApiResponse({
    status: 200,
    description: "Dados do usuário encontrado com estatísticas",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", example: "user-uuid-123" },
        name: { type: "string", example: "João Silva" },
        email: { type: "string", example: "joao@email.com" },
        emailVerified: { type: "boolean", example: true },
        image: {
          type: "string",
          example: "https://avatar.url",
          nullable: true,
        },
        createdAt: { type: "string", example: "2025-08-04T10:00:00.000Z" },
        updatedAt: { type: "string", example: "2025-08-04T10:00:00.000Z" },
        _count: {
          type: "object",
          properties: {
            incomes: { type: "number", example: 25 },
            expenses: { type: "number", example: 50 },
            investments: { type: "number", example: 10 },
            sessions: { type: "number", example: 3 },
            accounts: { type: "number", example: 2 },
          },
        },
        stats: {
          type: "object",
          properties: {
            incomes: {
              type: "object",
              properties: {
                total: { type: "number", example: 15000.5 },
                count: { type: "number", example: 25 },
              },
            },
            expenses: {
              type: "object",
              properties: {
                total: { type: "number", example: 8500.75 },
                count: { type: "number", example: 50 },
              },
            },
            investments: {
              type: "object",
              properties: {
                total: { type: "number", example: 5000.0 },
                count: { type: "number", example: 10 },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "ID do usuário não foi fornecido",
  })
  @ApiResponse({
    status: 404,
    description: "Usuário não encontrado",
  })
  findById(@Query() query: GetUserByIdDto) {
    return this.service.getUserWithStats(query.id);
  }
}
