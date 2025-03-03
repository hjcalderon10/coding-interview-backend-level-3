export class Item {
  constructor(
    public id: string | null,
    public name: string,
    public price: number,
    public createdAt?: Date,
  ) {}
}