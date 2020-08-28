import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../typeorm/entities/Customer';

export default interface ICustomerRepository {
  save(customer: Customer): Promise<Customer>;
  create(data: ICreateCustomerDTO): Promise<Customer>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | undefined>;
  findByEmail(email: string): Promise<Customer | undefined>;
  findByCPF(cpf: string): Promise<Customer | undefined>;
}
