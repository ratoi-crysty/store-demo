import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@store-demo/api-interfaces';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) public repo: Repository<UserEntity>) {
  }

  async countByRole(role: UserRole): Promise<number> {
    const query: { sum: number | null } | undefined = await this.repo.createQueryBuilder('user')
      .select('SUM(user.id)', 'sum')
      .where('user.role = :role', { role })
      .getRawOne<{ sum: number | null }>();

    return query?.sum || 0;
  }
}
