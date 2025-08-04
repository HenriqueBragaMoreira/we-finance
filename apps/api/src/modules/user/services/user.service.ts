import { Injectable, NotFoundException } from "@nestjs/common";
import { FilterUserDto } from "../dtos/filter-user.dto";
import { UserRepository } from "../user.repository";

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  findAll(filter: FilterUserDto) {
    return this.repo.findAll(filter);
  }

  async findById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    return user;
  }

  async getUserWithStats(id: string) {
    const [user, stats] = await Promise.all([
      this.findById(id),
      this.repo.getUserStats(id),
    ]);

    return {
      ...user,
      stats,
    };
  }
}
