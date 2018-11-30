import * as request from "supertest";
import { app } from "../index";
import * as config from "../config";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("auth", () => {
  it("allows for disabled auth", async () => {
    config.auth.disabled = true;
    const response = await request(app.callback()).get("/api/v1/apps");
    expect(response.status).toEqual(200);
    config.auth.disabled = false;
  });

  it("allows for apikey auth", async () => {
    config.auth.api.enabled = true;
    config.auth.api.key = "secret";
    const response = await request(app.callback())
      .get("/api/v1/apps")
      .set("authorization", "bearer secret");
    expect(response.status).toEqual(200);
    config.auth.api.enabled = false;
  });

  it("disallows apikey auth", async () => {
    config.auth.api.enabled = true;
    config.auth.api.key = "secret";
    const response = await request(app.callback())
      .get("/api/v1/apps")
      .set("authorization", "bearer false");
    expect(response.status).toEqual(401);
    config.auth.api.enabled = false;
  });

  it("allows for header auth", async () => {
    config.auth.proxy.enabled = true;
    const response = await request(app.callback())
      .get("/api/v1/apps")
      .set("x-forwarded-email", "test@test.com");
    expect(response.status).toEqual(200);
    config.auth.proxy.enabled = false;
  });

  it("allows for jwt auth", async () => {
    // Valid token.
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.FtARbYkWuTqWJukNxFll3MQbN51nnhQ3NjDwdE8CUvc";

    config.auth.jwt.enabled = true;
    config.auth.jwt.secret = "secret";
    const response = await request(app.callback())
      .get("/api/v1/apps")
      .set("authorization", "bearer " + jwt);
    expect(response.status).toEqual(200);
    config.auth.jwt.enabled = false;
  });

  it("disallows jwt auth", async () => {
    // Invalid token.
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.b3RzdKevyGboB8cwnciU2A5bIGT_3EvWZd3GG_1HRdg";

    config.auth.jwt.enabled = true;
    config.auth.jwt.secret = "secret";
    const response = await request(app.callback())
      .get("/api/v1/apps")
      .set("authorization", "bearer " + jwt);
    expect(response.status).toEqual(401);
    config.auth.jwt.enabled = false;
  });
});
