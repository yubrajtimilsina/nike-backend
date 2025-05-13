import { Response, Request } from "express";
import Payment from "../database/models/paymentModel";
import { PaymentMethod, PaymentStatus } from "../services/types";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetaills";
import Cart from "../database/models/cartModel";
import axios from "axios";
import Shoe from "../database/models/productModel";
import Category from "../database/models/categoryModel";

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
      zipcode,
      totalPrice,
      paymentMethod,
      street,
    } = req.body;
    const shoes: IProduct[] = req.body.shoes;

    if (
      !phoneNumber ||
      !city ||
      !addressLine ||
      !state ||
      !zipcode ||
      !totalPrice ||
      shoes.length == 0 ||
      !firstName ||
      !lastName ||
      !email
    ) {
      res.status(400).json({
        message: "Please provide phoneNumber,totalAmount,products",
      });
      return;
    }

    // for payment
    let data;
    const paymentData = await Payment.create({
      paymentMethod: paymentMethod,
    });

    const orderData = await Order.create({
      userId: userId, // Fix: Add userId
      phoneNumber,
      firstName,
      lastName,
      email,
      city,
      addressLine,
      state,
      street,
      zipcode,
      totalPrice,
      paymentId: paymentData.id, // Fix: Use paymentId instead of paymentMethod
    });

    // for orderDetaills
    shoes.forEach(async function (product) {
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
        amount: totalPrice * 100,
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
        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
      });
    } else if (paymentMethod == PaymentMethod.Esewa) {
      // TODO: Implement Esewa payment flow
    } else {
      res.status(200).json({
        message: "Order created successfully",
        data,
      });
    }

  }
     async verifyTransaction(req:IAuth,res:Response):Promise<void>{
      const {pidx} = req.body 
      if(!pidx){
        res.status(400).json({
          message : "Please provide pidx"
        })
        return
      }
      const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{
        pidx : pidx
      },{
        headers : {
          "Authorization" : "Key b71142e3f4fd4da8acccd01c8975be38"
        }
      })
      const data = response.data 
      if(data.status === "Completed"){
        await Payment.update({paymentStatus : PaymentStatus.Paid},{
          where : {
            pidx : pidx 
          }
        })
        res.status(200).json({
          message : "Payment verified successfully !!"
        })
      }else{
        res.status(200).json({
          message : "Payment not verified or cancelled"
        })
      }

    }

  async fetchMyOrder(req: IAuth, res: Response):Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      attributes: ["totalPrice", "id", "orderStatus"],
      include: {
        model: Payment,
        attributes: ["paymentMethod", "paymentStatus"],
      },
    });
     if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
  }
  async  fetchMyOrderDetail(req:IAuth,res:Response):Promise<void>{
      const orderId = req.params.id 
      const userId = req.user?.id 
      const orders = await OrderDetails.findAll({
        where : {
          orderId, 

        }, 
        include : [{
          model : Order , 
          include : [
            {
              model : Payment, 
              attributes : ["paymentMethod","paymentStatus"]
            }
          ],
          attributes : ["orderStatus","AddressLine","City","State","totalAmount","phoneNumber", "firstName", "lastName","userId"]
        },{
          model : Shoe, 
          include : [{
            model : Category
          }], 
          attributes : ["productImageUrl","productName","productPrice"]
        }]
      })
      if(orders.length > 0){
        res.status(200).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
    
     async fetchAllOrders(req:IAuth,res:Response):Promise<void>{
      
      const orders = await Order.findAll({
       
        attributes : ["totalAmount","id","orderStatus"], 
        include : {
          model : Payment, 
          attributes : ["paymentMethod", "paymentStatus"]
        }
      })
      if(orders.length > 0){
        res.status(201).json({
          message : "Order fetched successfully", 
          data : orders 
        })
      }else{
        res.status(404).json({
          message : "No order found", 
          data : []
        })
      }
    }
}

export default new OrderController();
