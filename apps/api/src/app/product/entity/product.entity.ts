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
import { ProductModel } from '@store-demo/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

const { UPDATE, CREATE } = CrudValidationGroups;

@Entity()
export class ProductEntity implements ProductModel {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString()
  @MaxLength(255)
  @Column({ length: 255, type: 'varchar' })
  name!: string;

  @ApiProperty()
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsString()
  @MaxLength(255)
  @Column({ length: 255, type: 'varchar' })
  description!: string;

  @ApiProperty()
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true })
  oldPrice!: number;

  @ApiProperty()
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true })
  price!: number;

  @ApiProperty()
  @IsEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true, default: 0 })
  ratingValue!: number;

  @ApiProperty()
  @IsEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber()
  @Column({ type: 'int', unsigned: true, default: 0 })
  ratingCounter!: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Column({ type: 'int', unsigned: true, default: 0 })
  stock!: number;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  @Column({ type: 'simple-array', default: '' })
  images!: string[];

  @ApiProperty({ readOnly: true })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn()
  updateAt!: Date;

  @ApiProperty({ readOnly: true })
  @DeleteDateColumn()
  deleteAt!: Date;
}
