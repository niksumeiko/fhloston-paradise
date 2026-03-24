const request = require("supertest");
const app = require("./app");

describe("The boarding gate", () => {
  it("rejects passengers with unknown credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "zorg@fhloston.com", password: "destroyall" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email or password" });
  });
});
