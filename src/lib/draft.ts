/**
 * draft — 작업 중 입력의 자동저장 (감사 2026-07-29 #151).
 *
 * ⚠이 앱은 '저장한 조명·결과'만 보존하고 **작업 중인 입력**(면적·층고·공간
 *   유형·선택한 조명)은 아무 데도 안 남겼다. 자동저장도 이탈 경고도 없어
 *   새로고침 한 번, 탭 실수로 닫기 한 번에 작업이 전소됐다.
 *
 * 설계: 화면 상태 중 **다시 만들 수 없는 것만** 담는다(계산 결과는 파생이라
 * 제외 — 저장했다가 계산식이 바뀌면 낡은 값을 되살리게 된다).
 * 저장이 실패해도(용량 초과·사생활 보호 모드) 앱은 계속 동작해야 한다.
 */

export const DRAFT_KEY = "iggg-lux:draft";

export type Draft = {
  area: string;
  height: string;
  spaceTypeName: string;
  desiredLux: number;
  tone: string;
  selectedLights: unknown[];
  savedAt: string;
};

/** 되살릴 값이 실제로 있는가 — 기본값뿐인 초안은 복원해도 의미가 없다. */
export function isMeaningful(d: Partial<Draft> | null | undefined): boolean {
  if (!d) return false;
  return Array.isArray(d.selectedLights) && d.selectedLights.length > 0;
}

/** 초안 저장. 실패해도 던지지 않는다(저장 못 한다고 작업을 막을 수는 없다). */
export function saveDraft(store: Storage, d: Omit<Draft, "savedAt">, now: string): boolean {
  try {
    store.setItem(DRAFT_KEY, JSON.stringify({ ...d, savedAt: now }));
    return true;
  } catch {
    return false;      // 용량 초과·시크릿 모드 — 조용히 포기하되 앱은 계속
  }
}

/** 초안 복원. 깨진 값·의미 없는 값은 null. */
export function loadDraft(store: Storage): Draft | null {
  let raw: string | null = null;
  try {
    raw = store.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Draft;
    return isMeaningful(d) ? d : null;
  } catch {
    return null;       // 깨진 초안 때문에 앱이 안 뜨면 더 나쁘다
  }
}

export function clearDraft(store: Storage): void {
  try { store.removeItem(DRAFT_KEY); } catch { /* 지우기 실패는 무해 */ }
}
