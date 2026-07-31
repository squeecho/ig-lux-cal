import { describe, it, expect, beforeEach } from "vitest";
import { saveDraft, loadDraft, clearDraft, isMeaningful, DRAFT_KEY } from "./draft";

class MemStore {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  get length() { return this.m.size; }
}
class FullStore extends MemStore {
  setItem() { throw new Error("QuotaExceededError"); }
}

const BODY = {
  area: "33", height: "2700", spaceTypeName: "카페",
  desiredLux: 400, tone: "normal",
  selectedLights: [{ id: "a", name: "다운라이트", quantity: 6 }],
};

let s: MemStore;
beforeEach(() => { s = new MemStore(); });

describe("초안 자동저장 (감사 #151)", () => {
  it("저장한 작업이 새로고침 뒤에도 살아 있다", () => {
    expect(saveDraft(s as unknown as Storage, BODY, "2026-08-01T00:00:00Z")).toBe(true);
    const back = loadDraft(s as unknown as Storage);
    expect(back?.area).toBe("33");
    expect(back?.selectedLights).toHaveLength(1);
    expect(back?.savedAt).toBe("2026-08-01T00:00:00Z");
  });

  it("조명을 하나도 안 고른 상태는 되살리지 않는다(기본값 초안은 무의미)", () => {
    saveDraft(s as unknown as Storage, { ...BODY, selectedLights: [] }, "t");
    expect(loadDraft(s as unknown as Storage)).toBeNull();
  });

  it("저장 공간이 꽉 차도 앱은 계속 동작한다(던지지 않는다)", () => {
    const full = new FullStore();
    expect(() => saveDraft(full as unknown as Storage, BODY, "t")).not.toThrow();
    expect(saveDraft(full as unknown as Storage, BODY, "t")).toBe(false);
  });

  it("깨진 초안 때문에 앱이 안 뜨면 더 나쁘다 — null 로 넘긴다", () => {
    s.setItem(DRAFT_KEY, "{망가진 JSON");
    expect(loadDraft(s as unknown as Storage)).toBeNull();
  });

  it("초안이 없으면 null", () => {
    expect(loadDraft(s as unknown as Storage)).toBeNull();
  });

  it("지우면 사라진다", () => {
    saveDraft(s as unknown as Storage, BODY, "t");
    clearDraft(s as unknown as Storage);
    expect(loadDraft(s as unknown as Storage)).toBeNull();
  });

  it("isMeaningful — 조명 유무로 판정", () => {
    expect(isMeaningful(null)).toBe(false);
    expect(isMeaningful({ selectedLights: [] })).toBe(false);
    expect(isMeaningful({ selectedLights: [{}] })).toBe(true);
  });
});
