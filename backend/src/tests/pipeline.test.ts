import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL = "http://localhost:8080";

describe("Pipeline Creation Flow", () => {
  let apiKey: string;
  let createdUser: any;
  let createdPipeline: any;

  // generate unique data to avoid conflicts on repeated runs
  const timestamp = Date.now();
  const testEmail = `testpipeline${timestamp}@example.com`;
  const testUsername = `testPipelineUser${timestamp}`;

  beforeAll(async () => {
    // create user
    const userPayload = {
      username: testUsername,
      email: testEmail,
      password: "TestPassword123!",
    };

    const signupRes = await fetch(`${BASE_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload),
    });

    // error message
    if (signupRes.status !== 201) {
      const errorBody = await signupRes.text();
      console.error("Signup failed:", signupRes.status, errorBody);
      throw new Error(`Failed to create user. Status: ${signupRes.status}`);
    }

    createdUser = await signupRes.json();
    apiKey = createdUser.apiKey;

    expect(apiKey).toBeDefined();
    console.log(`✅ Test user created: ${testEmail}`);
  });

  it("should create a pipeline for the authenticated user", async () => {
    const pipelinePayload = {
      name: "My First Pipeline",
      actionType: "transform",
      actionConfig: {
        operation: "uppercase",
        fields: ["name", "email"],
      },
      subscribers: [
        {
          url: "https://httpbin.org/post",
          method: "POST",
        },
      ],
    };

    const response = await fetch(`${BASE_URL}/api/pipelines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apikey ${apiKey}`,
      },
      body: JSON.stringify(pipelinePayload),
    });

    expect(response.status).toBe(201);

    createdPipeline = await response.json();

    expect(createdPipeline.id).toBeDefined();
    expect(createdPipeline.userId).toBe(createdUser.id);

    console.log("✅ Pipeline created successfully!");
  });

  afterAll(async () => {
    if (!createdUser?.id || !apiKey) return;

    console.log("🧹 Cleaning up test data...");

    const deleteRes = await fetch(
      `${BASE_URL}/api/auth/users/${createdUser.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Apikey ${apiKey}`,
        },
      },
    );

    if (deleteRes.status === 204 || deleteRes.status === 200) {
      console.log("✅ Cleanup successful");
    } else {
      console.warn(`⚠️ Cleanup returned status ${deleteRes.status}`);
    }
  });
});
