import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// gen_p_listaopcion (tipos de id, sexo, etc.)
@Entity('gen_p_listaopcion')
export class ListaOpcion {
  @PrimaryGeneratedColumn() id: number;
  @Column() variable: string;
  @Column() descripcion: string;
  @Column() valor: number;
  @Column() nombre: string;
  @Column() abreviacion: string;
  @Column() habilita: boolean;
}
