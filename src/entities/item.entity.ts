export class Item {
  constructor(
    public id: string | null,
    public name: string,
    public price: number,
    public created_date?: Date,
  ) {}
}
export class UpdateItem {
  constructor(
    public name?: string,
    public price?: number,
  ) {}
}