import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "shoes",
  modelName: "Shoe",
  timestamps: true,
})
class Shoe extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shoeName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shoeBrand: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: Number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare imageUrl: string;
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  declare stock: Number;
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  declare discount: Number;
}

export default Shoe;
