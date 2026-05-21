import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  id: string; // e.g., 'analytical', 'lab-equipment'

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.categoryEntity)
  products: Product[];
}
