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
        .getRawOne<number | null>() as Promise<number | null>,
    )
      .pipe(
        map((count: number | null) => count || 0),
      );
  }
}
