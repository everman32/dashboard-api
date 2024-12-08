import { App } from "../src/app";
import request from "supertest";
import bootstrap from "../src/main";

let application: App;

beforeAll(async () => {
  const app = await bootstrap;
  application = app;
});

describe("users e2e", () => {
  it("Register - error", async () => {
    const res = await request(application.app)
      .post("/users/register")
      .send({ email: "alex@gmail.com", password: "Alex123" });

    expect(res.statusCode).toBe(422);
  });

  it("Login - success", async () => {
    const res = await request(application.app)
      .post("/users/login")
      .send({ email: "alex@gmail.com", password: "Alex123" });

    expect(res.body.jwt).not.toBeUndefined();
  });

  it("Login - error", async () => {
    const res = await request(application.app)
      .post("/users/login")
      .send({ email: "alex@gmail.com", password: "Alex12" });

    expect(res.statusCode).toBe(401);
  });

  it("Info - success", async () => {
    const login = await request(application.app)
      .post("/users/login")
      .send({ email: "alex@gmail.com", password: "Alex123" });

    const res = await request(application.app)
      .get("/users/info")
      .set("Authorization", `Bearer ${login.body.jwt}`);

    expect(res.body.email).toBe("alex@gmail.com");
  });

  it("Info - error", async () => {
    const res = await request(application.app)
      .get("/users/info")
      .set("Authorization", "none");

    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
