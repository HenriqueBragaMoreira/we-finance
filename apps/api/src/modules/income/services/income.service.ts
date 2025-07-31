import { Injectable } from "@nestjs/common";
import { FilterIncomeDto } from "../dtos/filter-income.dto";
import { IncomeRepository } from "../income.repository";

@Injectable()
export class IncomeService {
  constructor(private readonly repo: IncomeRepository) {}

  findAll(filter: FilterIncomeDto) {
    return this.repo.findAll(filter);
  }
}
