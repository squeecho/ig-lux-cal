import { describe, it, expect } from "vitest";
import { hasWorkInProgress, loadConfirmMessage, deleteConfirmMessage } from "./overwriteGuard";

describe("덮어쓰기 확인 (감사 #150)", () => {
  it("조명을 골랐으면 작업 중이다", () => {
    expect(hasWorkInProgress({ selectedLights: [{ id: "a" }] })).toBe(true);
  });

  it("빈 화면은 작업 중이 아니다 — 쓸데없이 묻지 않는다", () => {
    expect(hasWorkInProgress({ selectedLights: [] })).toBe(false);
    expect(hasWorkInProgress(null)).toBe(false);
    expect(hasWorkInProgress(undefined)).toBe(false);
  });

  it("작업 중이면 '사라진다'고 분명히 말한다", () => {
    const m = loadConfirmMessage({ selectedLights: [1] }, "카페 3층");
    expect(m).toContain("카페 3층");
    expect(m).toContain("사라집니다");
  });

  it("작업 중이 아니면 묻지 않는다(확인창 피로 방지)", () => {
    expect(loadConfirmMessage({ selectedLights: [] }, "카페")).toBe("");
  });

  it("이름이 없어도 말이 된다", () => {
    expect(loadConfirmMessage({ selectedLights: [1] })).toContain("저장한 결과");
  });

  it("삭제는 작업 중이 아니어도 항상 묻는다 — 되돌릴 수 없다", () => {
    expect(deleteConfirmMessage("카페")).toContain("되돌릴 수 없습니다");
    expect(deleteConfirmMessage()).toContain("되돌릴 수 없습니다");
  });
});
