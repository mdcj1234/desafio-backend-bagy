export default interface ICustomerDTO {
  name: string;
  email: string;
  cpf: string;
  birthDate: Date;
  address: {
    street: string;
    neighbourhood: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
    number: number;
  };
}
