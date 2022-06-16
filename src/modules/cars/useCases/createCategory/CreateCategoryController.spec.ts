import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const encryptedPassword = await hash("admin", 8);
    const id = uuidv4();

    await connection.query(`
    INSERT INTO users (id, name, email, password, "isAdmin", driver_license, created_at)
    VALUES (
      '${id}',
      'admin',
      'admin@rentalx.com.br',
      '${encryptedPassword}',
      true,
      '0123456789',
      NOW()
    )
  `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new category", async () => {
    const responseToken = await request(app)
      .post("/sessions")
      .send({ email: "admin@rentalx.com.br", password: "admin" });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Hatch",
        description: "Compact lightweight car",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new  category with existing name", async () => {
    const responseToken = await request(app)
      .post("/sessions")
      .send({ email: "admin@rentalx.com.br", password: "admin" });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Hatch",
        description: "Compact lightweight car",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});