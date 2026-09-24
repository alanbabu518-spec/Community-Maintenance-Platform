import { describe, expect, it, vi } from "vitest";

vi.mock("../modules/notifications/push.repository.js", () => ({
  savePushSubscription: vi.fn(),
}));

import { subscribeUserToPush } from "../modules/notifications/push.service.js";
import { savePushSubscription } from "../modules/notifications/push.repository.js";

describe("subscribeUserToPush", () => {
  it("should accept a valid HTTPS push endpoint", async () => {
    vi.mocked(savePushSubscription).mockResolvedValue({
      id: 1,
      userId: 10,
      endpoint: "https://push.example.com/send/123",
      p256dh: "test-p256dh",
      auth: "test-auth",
    } as any);

    const data = {
      userId: 10,
      endpoint: "https://push.example.com/send/123",
      p256dh: "test-p256dh",
      auth: "test-auth",
    };

    await subscribeUserToPush(data);

    expect(savePushSubscription).toHaveBeenCalledWith(data);
  });

  it("should reject an HTTP endpoint", async () => {
    const data = {
      userId: 10,
      endpoint: "http://example.com/push",
      p256dh: "test-p256dh",
      auth: "test-auth",
    };

    await expect(subscribeUserToPush(data)).rejects.toThrow(
      "Invalid push subscription endpoint",
    );

    expect(savePushSubscription).not.toHaveBeenCalled();
  });

  it("should reject a malformed endpoint", async () => {
    const data = {
      userId: 10,
      endpoint: "not-a-valid-url",
      p256dh: "test-p256dh",
      auth: "test-auth",
    };

    await expect(subscribeUserToPush(data)).rejects.toThrow(
      "Invalid push subscription endpoint",
    );

    expect(savePushSubscription).not.toHaveBeenCalled();
  });

  it("should reject a non-HTTPS protocol", async () => {
    const data = {
      userId: 10,
      endpoint: "ftp://example.com/push",
      p256dh: "test-p256dh",
      auth: "test-auth",
    };

    await expect(subscribeUserToPush(data)).rejects.toThrow(
      "Invalid push subscription endpoint",
    );

    expect(savePushSubscription).not.toHaveBeenCalled();
  });
});