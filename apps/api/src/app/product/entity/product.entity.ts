import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

const { UPDATE, CREATE } = CrudValidationGroups;

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString()
  @MaxLength(255)
  @Column({ length: 255, type: 'varchar' })
  name!: string;

  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString()
  @MaxLength(255)
  @Column({ length: 255, type: 'varchar' })
  description!: string;

  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true })
  oldPrice!: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true })
  price!: number;

  @IsEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true, default: 0 })
  ratingValue!: number;

  @IsEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true, default: 0 })
  ratingCounter!: number;

  @IsOptional()
  @IsNumber()
  @Column({ type: 'int', unsigned: true, default: 0 })
  stock!: number;

  @IsOptional()
  @IsString({ each: true })
  @Column({ type: 'simple-array', default: '' })
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @DeleteDateColumn()
  deleteAt!: Date;
}
