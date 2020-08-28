import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductDTO from '@modules/products/dtos/IUpdateProductDTO';
import IFindProductDTO from '@modules/products/dtos/IFindProductDTO';
import Product from '../typeorm/entities/Product';

export default interface IOrdersRepository {
  save(product: Product): Promise<Product>;
  create(data: ICreateProductDTO): Promise<Product>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
  findByName(name: string): Promise<Product | undefined>;
  findAllById(products: IFindProductDTO[]): Promise<Product[]>;
  updateStock(products: IUpdateProductDTO[]): Promise<Product[]>;
}
