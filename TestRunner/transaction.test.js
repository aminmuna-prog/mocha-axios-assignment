import axios from "axios";
import { expect } from "chai";
import dotenv from "dotenv";
import jsonData from "../Utils/user.json" assert { type: "json" };
dotenv.config();

// const length = jsonData.length;
const customer1Number = jsonData[0].phone_number;
const customer2Number = jsonData[1].phone_number;
const agentNumber = jsonData[2].phone_number;
const merchantPhoneNumber = "01301831905";

describe("Transaction Activities", () => {
  describe("Deposit to Agent", () => {
    it("deposit 200tk from SYSTEM to agent", async () => {
      const { data } = await axios.post(
        `${process.env.base_url}/transaction/deposit`,
        {
          from_account: "SYSTEM",
          to_account: agentNumber,
          amount: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`,
          },
        }
      );
      console.log(data);
      expect(data.message).to.contains("Deposit successful");
    });
  });

  describe("Deposit from Agent to Customer1", () => {
    it("Deposit 1500tk to a customer from the agent", async () => {
      const { data } = await axios.post(
        `${process.env.base_url}/transaction/deposit`,
        {
          from_account: agentNumber,
          to_account: customer1Number,
          amount: 1500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`,
          },
        }
      );
      console.log(data);
      expect(data.message).to.contains("Deposit successful");
    });
  });

  describe("Customer1 Transactions", () => {
    it("Withdraw 500tk by the customer to the agent", async () => {
      const { data } = await axios.post(
        `${process.env.base_url}/transaction/withdraw`,
        {
          from_account: customer1Number,
          to_account: agentNumber,
          amount: 500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`,
          },
        }
      );
      console.log(data);
      expect(data.message).to.contains("Withdraw successful");
    });

    it("Send money 500tk to another customer", async () => {
      const { data } = await axios.post(
        `${process.env.base_url}/transaction/sendMoney`,
        {
          from_account: customer1Number,
          to_account: customer2Number,
          amount: 500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`,
          },
        }
      );
      console.log(data);
      expect(data.message).to.contains("Send money successful");
    });
  });

  describe("Customer2 Transactions", () => {
    it("Payment 100tk to any merchant by the recipient customer", async () => {
      const { data } = await axios.post(
        `${process.env.base_url}/transaction/payment`,
        {
          from_account: customer2Number,
          to_account: merchantPhoneNumber,
          amount: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`,
          },
        }
      );
      console.log(data);
      expect(data.message).to.contains("Payment successful");
    });

    it("Check balance of the recipient customer", async () => {
      const { data } = await axios.get(
        `${process.env.base_url}/transaction/balance/${customer2Number}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
            "X-AUTH-SECRET-KEY": `${process.env.secretKey}`,
          },
        }
      );
      console.log(data);
      expect(data.message).to.contains("User balance");
    });
  });

  // Delay 2000 ms after eachtests
  // afterEach(async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  // });
});
