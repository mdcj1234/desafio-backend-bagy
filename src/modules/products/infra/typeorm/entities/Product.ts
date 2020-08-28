/* eslint-disable camelcase */
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrderProducts';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image_url: string;

  @Column()
  description: string;

  @Column()
  weight: number;

  @Column()
  price: number;

  @Column()
  stock: number;

  @OneToMany(() => OrdersProducts, orderProducts => orderProducts.product)
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
