import { Service } from "typedi";

import { BaseService } from "@api/modules/services/Base.service";
import { Order } from "@api/entity/Order";
import https from "https";
import { Purchase } from "@api/entity/Purchase";

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
const telegramChatIds = (process.env.TELEGRAM_BOT_CHAT_IDS as string).split(",");

@Service()
export class OrderService extends BaseService<Order> {
  relations = ["user"];

  async sendNewOrderNotification(orderID: string): Promise<void> {
    const order = await this.findOne({
      where: { id: orderID },
      loadRelationIds: false,
    });
    if (!order) return;

    const user = await order.user;
    const purchases = await Purchase.find({
      where: { order },
      relations: ["product"],
      loadRelationIds: false,
    });
    if (!user || !purchases) return;
    const numberOfProducts = purchases.reduce((acc, n) => acc + n.quantity, 0);
    const products = await Promise.all(purchases.map((p) => p.product));
    const body = purchases.reduce(
      (acc, n, i) => `- ${n.quantity} ${products[i].name}
${acc}`,
      ""
    );
    const message = encodeURIComponent(
      `*🎉 New order #${order.orderNumber}*

${user.name} ordered ${numberOfProducts} products

${body}

Province: ${order.province}
Address: ${order.address}
Phone: ${order.phone ?? user.phone}
`
    );

    this.sendTelegramNotification(message);
  }

  async sendOrderCanceledNotification(orderID: string): Promise<void> {
    const order = await this.findOne({
      where: { id: orderID },
      loadRelationIds: false,
    });
    if (!order) return;

    const user = await order.user;

    const message = encodeURIComponent(
      `*🗑 Order #${order.orderNumber} canceled*

${user.name} canceled order #${order.orderNumber}

Province: ${order.province}
Address: ${order.address}
Phone: ${order.phone ?? user.phone}
`
    );

    this.sendTelegramNotification(message);
  }

  async sendTelegramNotification(message: string): Promise<void> {
    let promises: Promise<void>[] = [];

    for (const chatID of telegramChatIds) {
      promises.push(
        new Promise((resolve, reject) => {
          const req = https.request(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatID}&parse_mode=Markdown&text=${message}`,
            (res) => {
              if (res.statusCode === 200) {
                return resolve();
              }

              return reject(`failed with status ${res.statusCode}`);
            }
          );

          req.on("error", (error) => {
            reject(`failed to send notification: ${error.message}`);
          });

          req.end();
        })
      );
    }

    await Promise.all(promises);
  }
}
