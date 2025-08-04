import { Module } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { PaymentMethodController } from "./controllers/payment-method.controller";
import { PaymentMethodRepository } from "./payment-method.repository";
import { PaymentMethodService } from "./services/payment-method.service";

@Module({
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PaymentMethodRepository, PrismaService],
  exports: [PaymentMethodService, PaymentMethodRepository],
})
export class PaymentMethodModule {}
