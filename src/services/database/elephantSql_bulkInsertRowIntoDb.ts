import Order, { OrderAttributes } from "./models/elephantSql_order";

import { logger } from "../../utils/logger";

const bulkInsertRowIntoDb = async (orders: OrderAttributes[]) => {
  try {
    await Order.bulkCreate(orders);
    logger.info({
      message: "Successfully bulk inserted into DB",
      meta: { orders },
    });
  } catch (error) {
    logger.error({
      message: "Error while bulk inserting into DB",
      meta: { orders },
      error,
    });
  }
};

export default bulkInsertRowIntoDb;
