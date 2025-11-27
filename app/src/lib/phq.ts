const scoreMap: Record<string, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
};

export const computePhqScore = (answers: Record<string, string>) => {
  return Object.values(answers).reduce((sum, val) => {
    const prefix = val?.trim().charAt(0);
    return sum + (scoreMap[prefix] ?? 0);
  }, 0);
};

export const mapSeverity = (score: number) => {
  if (score <= 4) return "无抑郁症状";
  if (score <= 9) return "轻度";
  if (score <= 14) return "中度";
  if (score <= 19) return "中重度";
  return "重度";
};
