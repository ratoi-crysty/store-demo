import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity, UserEntityRole } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) public repo: Repository<UserEntity>) {
  }

  countByRole(role: UserEntityRole): Observable<number> {
    return from(
      this.repo.createQueryBuilder('user')
        .select('SUM(user.id)', 'sum')
        .where('user.role = :role', { role })
        .getRawOne<{ sum: number | null }>() as Promise<{ sum: number | null }>,
    )
      .pipe(
        map(({ sum }: { sum: number | null }) => sum || 0),
      );
  }
}
