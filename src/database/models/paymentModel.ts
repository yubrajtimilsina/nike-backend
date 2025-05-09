import { Table, Column, DataType, Model } from "sequelize-typescript";
import { PaymentMethod, PaymentStatus } from "../../services/types";

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(
      PaymentMethod.COD,
      PaymentMethod.Esewa,
      PaymentMethod.Khalti
    ),
    allowNull: false, // required : false
  })
  declare paymentMethod: string;

  @Column({
    type: DataType.ENUM(PaymentStatus.Paid, PaymentStatus.Unpaid),
    allowNull: false, // required : false
  })
  declare paymentStatus: string;
}

export default Payment;
