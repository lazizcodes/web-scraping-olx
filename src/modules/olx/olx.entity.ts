// import * as mongoose from 'mongoose';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'olx' })
export class Olx {
  @PrimaryColumn()
  id: String;

  @Column()
  title: String;

  @Column()
  price: String;

  @Column()
  imgUrl: String;

  @Column()
  location: String;

  @Column()
  adCreatedAt: String;

  @Column({ type: 'date' })
  createdAt: Date;
}
