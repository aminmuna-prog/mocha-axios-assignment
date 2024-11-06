import axios from "axios";
import { expect } from "chai";
import dotenv from "dotenv";
import storeToken from "../Config/setEnvVar.js";
dotenv.config();

import { faker } from "@faker-js/faker";
import fs from "fs";
import jsonData from "../Utils/user.json" assert { type: "json" };
import generateRandomId from "../Utils/utils.js";

describe("Login by admin", () => {
  it("Login by admin with valid creds", async () => {
    const { data } = await axios.post(
      `${process.env.base_url}/user/login`,
      {
        email: "admin@roadtocareer.net",
        password: "1234",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(data);
    expect(data.message).to.contain("Login successful");

    // Store token
    storeToken("token", data.token);
  });
});

const createUser = async (namePrefix, role) => {
  try {
    const { data } = await axios.post(
      `${process.env.base_url}/user/create`,
      {
        name: `${namePrefix} ${faker.person.firstName()}`,
        email: faker.internet.email(),
        password: "1234",
        phone_number: `01625${generateRandomId(100000, 999999)}`,
        nid: "123456789",
        role: role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.token}`,
          "X-AUTH-SECRET-KEY": process.env.secretKey,
        },
      }
    );

    console.log(data);
    expect(data.message).to.contains("User created");

    jsonData.push(data.user);
    fs.writeFileSync("./Utils/user.json", JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

describe("Create 2 new customers and an agent", () => {
  it("Create Customer 1", async () => {
    await createUser("Customer1", "Customer");
  });

  it("Create Customer 2", async () => {
    await createUser("Customer2", "Customer");
  });

  it("Create Agent", async () => {
    await createUser("Agent", "Agent");
  });
});
