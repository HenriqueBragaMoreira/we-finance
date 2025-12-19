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
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type { CreatePaymentMethodDto } from "../dtos/create-payment-method.dto";
import type { FilterPaymentMethodDto } from "../dtos/filter-payment-method.dto";
import type { UpdatePaymentMethodDto } from "../dtos/update-payment-method.dto";
import { PaymentMethodService } from "../services/payment-method.service";

@ApiTags("Payment Methods")
@Controller("payment-methods")
export class PaymentMethodController {
  constructor(private readonly service: PaymentMethodService) {}

  @Get()
  @ApiOperation({
    summary: "Lista métodos de pagamento com filtros e paginação",
  })
  @ApiQuery({
    name: "name",
    required: false,
    type: String,
    description: "Filtrar por nome do método de pagamento",
  })
  @ApiQuery({
    name: "isActive",
    required: false,
    type: String,
    description: "Filtrar por status ativo (true/false)",
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
    description:
      "Lista paginada de métodos de pagamento com total de registros",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "cm0x1y2z3" },
              name: { type: "string", example: "PIX" },
              isActive: { type: "boolean", example: true },
              createdAt: {
                type: "string",
                example: "2025-08-03T10:00:00.000Z",
              },
              updatedAt: {
                type: "string",
                example: "2025-08-03T10:00:00.000Z",
              },
            },
          },
        },
        totalLength: { type: "number", example: 25 },
        activeCount: { type: "number", example: 15 },
        inactiveCount: { type: "number", example: 10 },
      },
    },
  })
  findAll(@Query() filter: FilterPaymentMethodDto) {
    return this.service.findAll(filter);
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um método de pagamento por ID" })
  @ApiResponse({
    status: 200,
    description: "Método de pagamento encontrado",
  })
  @ApiResponse({
    status: 404,
    description: "Método de pagamento não encontrado",
  })
  findById(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Get(":id/usage")
  @ApiOperation({
    summary: "Verifica se um método de pagamento está sendo usado",
    description:
      "Retorna informações sobre o uso do método de pagamento em transações",
  })
  @ApiResponse({
    status: 200,
    description: "Informações de uso do método de pagamento",
    schema: {
      type: "object",
      properties: {
        isInUse: { type: "boolean", example: true },
        incomeCount: { type: "number", example: 5 },
        expenseCount: { type: "number", example: 3 },
        totalCount: { type: "number", example: 8 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Método de pagamento não encontrado",
  })
  checkUsage(@Param("id") id: string) {
    return this.service.checkUsage(id);
  }

  @Post()
  @ApiOperation({ summary: "Cria um novo método de pagamento" })
  @ApiBody({
    description: "Dados para criar um novo método de pagamento",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Cartão de Crédito",
          description: "Nome do método de pagamento",
        },
        isActive: {
          type: "boolean",
          example: true,
          description: "Se o método está ativo (padrão: true)",
          default: true,
        },
      },
      required: ["name"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Método de pagamento criado com sucesso",
  })
  @ApiResponse({
    status: 409,
    description: "Método de pagamento com este nome já existe",
  })
  create(@Body() data: CreatePaymentMethodDto) {
    return this.service.create(data);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um método de pagamento existente" })
  @ApiBody({
    description: "Dados para atualizar um método de pagamento existente",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Cartão de Débito",
          description: "Nome do método de pagamento (opcional)",
        },
        isActive: {
          type: "boolean",
          example: false,
          description: "Se o método está ativo (opcional)",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Método de pagamento atualizado com sucesso",
  })
  @ApiResponse({
    status: 404,
    description: "Método de pagamento não encontrado",
  })
  @ApiResponse({
    status: 409,
    description: "Método de pagamento com este nome já existe",
  })
  update(@Param("id") id: string, @Body() data: UpdatePaymentMethodDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Remove um método de pagamento",
    description:
      "Remove um método de pagamento apenas se não estiver sendo usado em transações. Use PATCH para desativar se estiver em uso.",
  })
  @ApiResponse({
    status: 200,
    description: "Método de pagamento removido com sucesso",
  })
  @ApiResponse({
    status: 404,
    description: "Método de pagamento não encontrado",
  })
  @ApiResponse({
    status: 400,
    description:
      "Método de pagamento não pode ser removido pois está sendo usado em transações",
  })
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
