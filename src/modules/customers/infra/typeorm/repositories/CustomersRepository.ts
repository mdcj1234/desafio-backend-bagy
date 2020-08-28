import { getRepository, Repository } from 'typeorm';

import ICustomerRepository from '@modules/customers/infra/repository/ICustomerRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';

class CustomersRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  async save(customer: Customer): Promise<Customer> {
    return this.ormRepository.save(customer);
  }

  async create({
    name,
    email,
    cpf,
    birthDate,
    address,
  }: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create({
      name,
      email,
      cpf,
      birthDate,
      address,
    });
    await this.ormRepository.save(customer);

    return customer;
  }

  async delete(id: string): Promise<boolean> {
    await this.ormRepository.delete(id);

    return true;
  }

  async list(): Promise<Customer[]> {
    return this.ormRepository.find();
  }

  async findById(id: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({
      where: { email },
    });
  }

  async findByCPF(cpf: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({
      where: { cpf },
    });
  }
}

export default CustomersRepository;
