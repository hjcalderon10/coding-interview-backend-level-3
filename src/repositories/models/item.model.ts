export class ItemModel {
    constructor(
      public id: string,
      public name: string,
      public price: number,
      public created_date: Date,
      public deleted_date: Date | null
    ) {}
  }