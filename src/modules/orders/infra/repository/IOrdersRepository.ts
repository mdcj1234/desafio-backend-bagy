import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../typeorm/entities/Order';

export default interface IOrdersRepository {
  save(order: Order): Promise<Order>;
  create(data: ICreateOrderDTO): Promise<Order>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Order[]>;
  findById(id: string): Promise<Order | undefined>;
}
