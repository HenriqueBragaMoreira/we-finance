import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { CreatePaymentMethodDto } from "../dtos/create-payment-method.dto";
import { FilterPaymentMethodDto } from "../dtos/filter-payment-method.dto";
import type { UpdatePaymentMethodDto } from "../dtos/update-payment-method.dto";
import { PaymentMethodRepository } from "../payment-method.repository";

@Injectable()
export class PaymentMethodService {
  constructor(private readonly repo: PaymentMethodRepository) {}

  findAll(filter: FilterPaymentMethodDto) {
    return this.repo.findAll(filter);
  }

  async create(data: CreatePaymentMethodDto) {
    const existingPaymentMethod = await this.repo.findByName(data.name);
    if (existingPaymentMethod) {
      throw new ConflictException(
        `Payment method with name '${data.name}' already exists`
      );
    }

    return this.repo.create({
      name: data.name,
      isActive: data.isActive ?? true,
    });
  }

  async findById(id: string) {
    const paymentMethod = await this.repo.findById(id);
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with id '${id}' not found`);
    }
    return paymentMethod;
  }

  async update(id: string, data: UpdatePaymentMethodDto) {
    await this.findById(id);

    if (data.name) {
      const existingPaymentMethod = await this.repo.findByName(data.name);
      if (existingPaymentMethod && existingPaymentMethod.id !== id) {
        throw new ConflictException(
          `Payment method with name '${data.name}' already exists`
        );
      }
    }

    return this.repo.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    const usageInfo = await this.repo.checkIfPaymentMethodIsInUse(id);

    if (usageInfo.isInUse) {
      throw new BadRequestException(
        `Cannot delete payment method because it is being used by ${usageInfo.totalCount} transaction(s) ` +
          `(${usageInfo.incomeCount} income(s) and ${usageInfo.expenseCount} expense(s)). ` +
          `Consider deactivating it instead by setting isActive to false.`
      );
    }

    return this.repo.delete(id);
  }

  async checkUsage(id: string) {
    await this.findById(id);

    return this.repo.checkIfPaymentMethodIsInUse(id);
  }
}
