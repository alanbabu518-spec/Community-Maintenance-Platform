import { describe, expect, it } from "vitest";
import { escapeHtml } from "../utils/htmlEscape.js";

describe("escapeHtml - SEC-07", () => {
  it("should escape HTML characters", () => {
    const maliciousInput =
      '<script>alert("xss")</script>';

    const result = escapeHtml(maliciousInput);

    expect(result).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    );
  });

  it("should escape quotes and ampersands", () => {
    const input = `Tom & Jerry's "Community"`;

    const result = escapeHtml(input);

    expect(result).toBe(
      "Tom &amp; Jerry&#039;s &quot;Community&quot;",
    );
  });

  it("should leave normal text unchanged", () => {
    const input = "Alan";

    expect(escapeHtml(input)).toBe("Alan");
  });
});
