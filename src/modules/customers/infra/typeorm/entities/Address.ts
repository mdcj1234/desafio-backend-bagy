import { Column } from 'typeorm';

export default class Address {
  @Column()
  street: string;

  @Column()
  neighbourhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zipcode: number;

  @Column()
  number: number;
}
