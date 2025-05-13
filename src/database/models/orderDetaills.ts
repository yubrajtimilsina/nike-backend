import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Order from "./orderModel";
import Shoe from "./productModel";

@Table({
  tableName: "orderDetails",
  modelName: "OrderDetails",
  timestamps: true,
})
class OrderDetails extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare orderId: string;

  @ForeignKey(() => Shoe)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productId: string;
}

export default OrderDetails;
