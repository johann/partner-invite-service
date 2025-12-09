import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { formatDate, formatTimeAgo } from "./formatters";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("formatDate", () => {
  it("returns a month abbreviation with day", () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    const formatted = formatDate(new Date("2024-02-03T00:00:00Z"));
    expect(formatted).toMatch(/Feb/);
  });
});

describe("formatTimeAgo", () => {
  it("returns minutes for recent timestamps", () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    const formatted = formatTimeAgo(new Date("2024-06-01T11:45:00Z"));
    expect(formatted).toBe("15m ago");
  });

  it("returns hours when appropriate", () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    const formatted = formatTimeAgo(new Date("2024-06-01T09:00:00Z"));
    expect(formatted).toBe("3h ago");
  });
});