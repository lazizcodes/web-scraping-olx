import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'olx' })
export class Olx {
  @ApiProperty({ description: 'unique identifier' })
  @PrimaryColumn()
  _id: String;

  @ApiProperty()
  @Column()
  title: String;

  @ApiProperty()
  @Column()
  price: String;

  @ApiProperty()
  @Column()
  imgUrl: String;

  @ApiProperty()
  @Column()
  location: String;

  @ApiProperty()
  @Column()
  adCreatedAt: String;

  @ApiProperty({ type: Date })
  @Column({ type: 'date' })
  createdAt: Date;
}
