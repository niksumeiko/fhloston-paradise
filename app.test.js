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

  it("rejects a known passenger with wrong password", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "korben@fhloston.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email or password" });
  });

  it("grants Korben Dallas access with valid credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "korben@fhloston.com", password: "multipass" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        id: 1,
        name: "Korben Dallas",
        email: "korben@fhloston.com",
        picture: "/images/korben.png",
      },
    });
  });

  it("grants Leeloo access with valid credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "leeloo@fhloston.com", password: "leeloo123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        id: 2,
        name: "Leeloo",
        email: "leeloo@fhloston.com",
        picture: "/images/leeloo.png",
      },
    });
  });

  it("grants Ruby Rhod access with valid credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "ruby@fhloston.com", password: "greenrocks" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
      user: {
        id: 3,
        name: "Ruby Rhod",
        email: "ruby@fhloston.com",
        picture: "/images/ruby.png",
      },
    });
  });
});
