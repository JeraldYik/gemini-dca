import { Order } from "./models/order";

const insertRowIntoDb = async () => {
  const testRow = await Order.create({
    fiatDepositInSgd: 10,
    pricePerCoinInSgd: 1,
    coinAmount: 1,
  });
  console.log(testRow);
};

export default insertRowIntoDb;
