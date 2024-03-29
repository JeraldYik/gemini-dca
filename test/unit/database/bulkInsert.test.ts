import Order, {
  OrderAttributes,
} from "../../../src/services/database/models/elephantSql_order";

import { expect } from "chai";
import { Sequelize } from "sequelize";
import bulkInsertRowIntoDb from "../../../src/services/database/elephantSql_bulkInsertRowIntoDb";
import { TODAY_DATE } from "../../../src/utils/constants";
import { elephantSqlSequelize as sequelize } from "./../../../src/setup/database";

describe("UNIT TEST: Bulk Insert into database", async () => {
  let sequelizeInstance: Sequelize;
  before(() => {
    sequelizeInstance = sequelize;
  });
  it("Should successfully bulk insert", async () => {
    const VALUES: OrderAttributes[] = [
      {
        ticker: "btcsgd",
        createdForDay: TODAY_DATE,
        fiatDepositInSgd: 10,
        pricePerCoinInSgd: 100,
        coinAmount: 1,
      },
      {
        ticker: "ethsgd",
        createdForDay: TODAY_DATE,
        fiatDepositInSgd: 20,
        pricePerCoinInSgd: 100,
        coinAmount: 1,
      },
    ];

    await bulkInsertRowIntoDb(VALUES);
    const btcSgdRow = await Order.findOne({
      where: {
        ticker: "btcsgd",
        createdForDay: TODAY_DATE,
      },
    });
    const ethSgdRow = await Order.findOne({
      where: {
        ticker: "ethsgd",
        createdForDay: TODAY_DATE,
      },
    });
    expect(btcSgdRow).to.exist;
    expect(btcSgdRow!.get().ticker).to.be.eql("btcsgd");
    expect(btcSgdRow!.get().createdForDay).to.be.eql(TODAY_DATE);
    expect(btcSgdRow!.get().fiatDepositInSgd).to.be.eql(10);
    expect(btcSgdRow!.get().pricePerCoinInSgd).to.be.eql(100);
    expect(btcSgdRow!.get().coinAmount).to.be.eql(1);

    expect(ethSgdRow).to.exist;
    expect(ethSgdRow!.get().ticker).to.be.eql("ethsgd");
    expect(ethSgdRow!.get().createdForDay).to.be.eql(TODAY_DATE);
    expect(ethSgdRow!.get().fiatDepositInSgd).to.be.eql(20);
    expect(ethSgdRow!.get().pricePerCoinInSgd).to.be.eql(100);
    expect(ethSgdRow!.get().coinAmount).to.be.eql(1);
  });

  after(async () => {
    await Order.destroy({
      where: {
        ticker: "btcsgd",
      },
    });
    await Order.destroy({
      where: {
        ticker: "ethsgd",
      },
    });
  });
});
