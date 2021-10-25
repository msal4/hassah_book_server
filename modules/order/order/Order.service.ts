import { Service } from "typedi";

import { BaseService } from "@api/modules/services/Base.service";
import { Order } from "@api/entity/Order";
import https from "https";

@Service()
export class OrderService extends BaseService<Order> {
  relations = ["user"];

  async sendOrderNotification(orderID: string): Promise<void> {
    const order = await this.findOne({
      where: { id: orderID },
      relations: ["user", "purchases"],
      loadRelationIds: false,
    });
    if (!order) return;

    const token = "2018063421:AAFgJ2egItoYkeoCYJPWZiRCVNXD-CGMhHw";
    const chatID = "167168217";
    const user = await order.user;
    const purchases = await order.purchases;
    if (!user || !purchases) return;
    const message = `${user.name} ordered ${purchases.reduce((acc, n) => acc + n.quantity, 0)} products`;

    const req = https.request(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&parse_mode=Markdown&text=${message}`,
      (res) => {
        console.log("notification status:", res.statusCode);
      }
    );

    req.on("error", (error) => {
      console.error("notification failed:", error);
    });

    req.end();
  }
}
