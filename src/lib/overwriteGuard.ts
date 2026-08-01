/**
 * overwriteGuard — 되돌릴 수 없는 덮어쓰기·삭제 전 확인 (감사 2026-07-29 #150).
 *
 * ⚠「불러오기」가 실제로는 **현재 작업을 전부 덮어쓴다**. 확인이 없고, 바로 옆에
 *   삭제 버튼이 있어 오탭도 쉽다. 작성 중이던 선택 조명·면적이 확인 없이 전멸했다.
 *
 * 규약: **작업 중일 때만** 묻는다. 빈 화면에서까지 확인창을 띄우면 사람은
 * 확인창을 읽지 않고 누르는 습관이 든다 — 정작 필요할 때 무력해진다.
 */

export type WorkState = {
  selectedLights?: unknown[];
  area?: string;
  height?: string;
};

/** 덮어쓰면 잃을 것이 있는가 — 조명을 하나라도 골랐으면 작업 중이다. */
export function hasWorkInProgress(s: WorkState | null | undefined): boolean {
  return Array.isArray(s?.selectedLights) && s.selectedLights.length > 0;
}

/** 불러오기 확인 문구(필요 없으면 빈 문자열 = 묻지 않는다). */
export function loadConfirmMessage(s: WorkState | null | undefined, name = ""): string {
  if (!hasWorkInProgress(s)) return "";
  const what = name ? `'${name}'` : "저장한 결과";
  return `${what}을 불러오면 지금 고른 조명과 입력이 모두 사라집니다. 계속할까요?`;
}

/** 삭제 확인 문구 — 삭제는 되돌릴 수 없으니 항상 묻는다. */
export function deleteConfirmMessage(name = ""): string {
  return `${name ? `'${name}'` : "이 결과"}를 삭제할까요? 되돌릴 수 없습니다.`;
}
