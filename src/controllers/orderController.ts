import { Response, Request } from "express";
import Payment from "../database/models/paymentModel";
import { PaymentMethod } from "../services/types";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetaills";
import Cart from "../database/models/cartModel";
import axios from "axios";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}
interface IProduct {
  productId: string;
  productQty: number;
}
class OrderController {
  async createOrder(req: IAuth, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      zipCode,
      totalAmount,
      paymentMethod,
    } = req.body;
    const products: IProduct[] = req.body;

    if (
      !phoneNumber ||
      !city ||
      !addressLine ||
      !state ||
      !zipCode ||
      !totalAmount ||
      products.length == 0 ||
      !firstName ||
      !lastName ||
      !email
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber,shippingAddress,totalAmount,products",
      });
      return;
    }

    // for payment

    let data;
    const paymentData = await Payment.create({
      paymentData: PaymentMethod,
    });

    const orderData = await Order.create({
      phoneNumber,
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      zipCode,
      totalAmount,
      paymentMethod: paymentData.id,
    });

    // for orderDetaills

    products.forEach(async function (product) {
      data = await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });

      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId,
        },
      });
    });

    // for payment
    if (paymentMethod === PaymentMethod.Khalti) {
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key 5d818e0244bd414f99ad73e584d04e11",
          },
        }
      );

      const khaltiResponse = response.data;

      paymentData.pidx = khaltiResponse.pidx;
      await paymentData.save();
      res.status(201).json({
        message: "order created successfully",

        data,
      });
    } else if (paymentMethod === PaymentMethod.Esewa) {
        const esewaConfig = {
            amt: totalAmount.toFixed(2),
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: totalAmount.toFixed(2),
            pid: orderData.id,
            scd: "EPAYTEST", // use actual merchant code in production
            su: `http://localhost:5173/payment/success?orderId=${orderData.id}`,
            fu: `http://localhost:5173/payment/failure?orderId=${orderData.id}`,
          };
        
          // Construct eSewa redirect URL
          const esewaUrl = `https://uat.esewa.com.np/epay/main?` +
            Object.entries(esewaConfig)
              .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
              .join("&");
        
          res.status(200).json({
            message: "Order created, redirect to eSewa",
            redirectUrl: esewaUrl,
          });
        }
        else{
            res.status(201).json({
                message:"order created successfully",
                
                
                data
        
              })
        }
  }
}

export default new OrderController();
