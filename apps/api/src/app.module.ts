import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { auth } from "./lib/auth";
import { CategoryModule } from "./modules/category/category.module";
import { ExpenseModule } from "./modules/expense/expense.module";
import { IncomeModule } from "./modules/income/income.module";
import { InvestmentModule } from "./modules/investment/investment.module";

@Module({
  imports: [
    AuthModule.forRoot(auth),
    IncomeModule,
    ExpenseModule,
    CategoryModule,
    InvestmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
