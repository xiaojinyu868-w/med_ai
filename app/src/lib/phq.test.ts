import { describe, expect, it } from "vitest";
import { computePhqScore, mapSeverity } from "./phq";

describe("PHQ-9 helpers", () => {
  it("computes score from prefixed answers", () => {
    const answers = { q1: "0 完全不会", q2: "1 好几天", q3: "3 几乎每天" };
    expect(computePhqScore(answers)).toBe(4);
  });

  it("maps severity buckets", () => {
    expect(mapSeverity(3)).toBe("无抑郁症状");
    expect(mapSeverity(7)).toBe("轻度");
    expect(mapSeverity(12)).toBe("中度");
    expect(mapSeverity(17)).toBe("中重度");
    expect(mapSeverity(22)).toBe("重度");
  });
});
