import type { LightData, SpaceType, InteriorToneOption } from '../types'

/* ───────── 조명 카탈로그 (47개) ─────────
   기존 데이터 유지. 추가 시 이 파일만 수정하면 됨.
*/
export const LIGHT_CATALOG: LightData[] = [
  /* === 다운라이트 === */
  { name:'COB실린더 3인치', lumenByColorTemp:{'3000K':510,'4000K':510,'5000K':510}, watt:6, colorTemps:['3000K','4000K','5000K'], size:'3인치', category:'다운라이트', thumbnail:'/images/lights/cob_3inch.png' },
  { name:'오스람LED 2인치(ledvance)', lumenByColorTemp:{'3000K':560,'4000K':560,'5700K':560}, watt:8, colorTemps:['3000K','4000K','5700K'], size:'2인치', category:'다운라이트', thumbnail:'/images/lights/osram_2inch.png' },
  { name:'오스람LED 3인치', lumenByColorTemp:{'3000K':540,'4000K':580,'6500K':580}, watt:8, colorTemps:['3000K','4000K','6500K'], size:'3인치', category:'다운라이트', thumbnail:'/images/lights/osram_3inch.png' },
  { name:'오스람LED 6인치(ledvance)', lumenByColorTemp:{'3000K':1300,'4000K':1400,'5700K':1400}, watt:20, colorTemps:['3000K','4000K','5700K'], size:'6인치', category:'다운라이트', thumbnail:'/images/lights/osram_6inch.png' },

  /* === 라인조명 === */
  { name:'오스람 T5(ledvance)', lumenByColorTemp:{'3000K':320,'4000K':320,'6500K':320}, watt:5, colorTemps:['3000K','4000K','6500K'], size:'300mm', category:'라인조명', thumbnail:'/images/lights/osram_t5.png' },
  { name:'진성T8(T7, T라인)', lumenByColorTemp:{'3000K':560,'4000K':560,'6500K':560}, watt:5, colorTemps:['3000K','4000K','6500K'], size:'300mm', category:'라인조명', thumbnail:'/images/lights/jinsung_t8.png' },
  { name:'예도LED T33', lumenByColorTemp:{'3000K':525,'4000K':525,'6500K':525}, watt:5, colorTemps:['3000K','4000K','6500K'], size:'300mm', category:'라인조명', thumbnail:'/images/lights/yedo_t33.png' },
  { name:'T70광폭', lumenByColorTemp:{'3000K':2700,'4000K':2700,'6500K':2700}, watt:30, colorTemps:['3000K','4000K','6500K'], size:'600mm', category:'라인조명', thumbnail:'/images/lights/t70.png' },

  /* === 레일조명 === */
  { name:'LED PAR30 (1등급 집중형)', lumenByColorTemp:{'3000K':1590,'4000K':1590,'6500K':1590}, watt:15, colorTemps:['3000K','4000K','6500K'], size:'PAR30', category:'레일조명', thumbnail:'/images/lights/led_par30_1.png' },
  { name:'LED PAR30 (일반집중,확산형)', lumenByColorTemp:{'3000K':1200,'4000K':1200,'6500K':1200}, watt:15, colorTemps:['3000K','4000K','6500K'], size:'PAR30', category:'레일조명', thumbnail:'/images/lights/led_par30_2.png' },
  { name:'COB 20W 원통 레일등', lumenByColorTemp:{'3000K':1300,'4000K':1300,'5700K':1300}, watt:20, colorTemps:['3000K','4000K','5700K'], size:'원통형', category:'레일조명', thumbnail:'/images/lights/cob_rail_20w.png' },

  /* === 벌브전구 === */
  { name:'비츠온 LED 에디슨전구 벌브형(E26)', lumenByColorTemp:{'2700K':680}, watt:8, colorTemps:['2700K'], size:'E26', category:'벌브전구', thumbnail:'/images/lights/bitzeon_edison.png' },
  { name:'비츠온 LED 벌브전구(E26)', lumenByColorTemp:{'3000K':910,'4000K':1000,'6500K':1000}, watt:12, colorTemps:['3000K','4000K','6500K'], size:'E26', category:'벌브전구', thumbnail:'/images/lights/bitzeon_bulb.png' },
  { name:'비츠온 LED T벌브전구(E26)', lumenByColorTemp:{'3000K':2520,'6500K':2520}, watt:30, colorTemps:['3000K','6500K'], size:'E26', category:'벌브전구', thumbnail:'/images/lights/bitzeon_tbulb.png' },

  /* === 평판등 === */
  { name:'오스람 평판등(640*640)', lumenByColorTemp:{'4000K':4500,'5700K':4500}, watt:50, colorTemps:['4000K','5700K'], size:'640x640mm', category:'평판등', thumbnail:'/images/lights/osram_panel_640.png' },
  { name:'오스람 평판등(1285*320)', lumenByColorTemp:{'4000K':4500,'5700K':4500}, watt:50, colorTemps:['4000K','5700K'], size:'1285x320mm', category:'평판등', thumbnail:'/images/lights/osram_panel_1285.png' },
  { name:'장수LED 십자등', lumenByColorTemp:{'6500K':4200}, watt:55, colorTemps:['6500K'], size:'L580*D60', category:'평판등', thumbnail:'/images/lights/jangsu_cross.png' },
  { name:'장수LED 스키등', lumenByColorTemp:{'2700K':4500,'6500K':4500}, watt:40, colorTemps:['2700K','6500K'], size:'800*60', category:'평판등', thumbnail:'/images/lights/jangsu_ski.png' },
  { name:'비츠온 주차장등', lumenByColorTemp:{'6500K':7200}, watt:80, colorTemps:['6500K'], size:'1200mm', category:'평판등', thumbnail:'/images/lights/bitzeon_parking.png' },

  /* === 간접조명 === */
  { name:'간접박스 속 오스람 T5', lumenByColorTemp:{'3000K':320,'4000K':320,'6500K':320}, watt:5, colorTemps:['3000K','4000K','6500K'], size:'300mm', category:'간접조명', thumbnail:'/images/lights/indirect_osram_t5.png' },
  { name:'간접박스 속 동성LED 슬림 라인바', lumenByColorTemp:{'3000K':92,'4000K':92,'6500K':92}, watt:1.2, colorTemps:['3000K','4000K','6500K'], size:'100mm', category:'간접조명', thumbnail:'/images/lights/indirect_dongsung.png' },

  /* === T20 마그네틱 — 라인 확산형 === */
  { name:'라인 확산형 등기구 12W', lumenByColorTemp:{'3000K':960,'4000K':960}, watt:12, colorTemps:['3000K','4000K'], size:'W300×D22×H25mm', category:'T20 마그네틱', type:'라인 확산형', thumbnail:'/images/lights/line_12w.png' },
  { name:'라인 확산형 등기구 24W', lumenByColorTemp:{'3000K':1920,'4000K':1920}, watt:24, colorTemps:['3000K','4000K'], size:'W600×D22×H25mm', category:'T20 마그네틱', type:'라인 확산형', thumbnail:'/images/lights/line_24w.png' },
  { name:'라인 확산형 등기구 30W', lumenByColorTemp:{'3000K':2400,'4000K':2400}, watt:30, colorTemps:['3000K','4000K'], size:'W900×D22×H25mm', category:'T20 마그네틱', type:'라인 확산형', thumbnail:'/images/lights/line_30w.png' },
  { name:'라인 확산형 등기구 40W', lumenByColorTemp:{'3000K':3200,'4000K':3200}, watt:40, colorTemps:['3000K','4000K'], size:'W1200×D22×H25mm', category:'T20 마그네틱', type:'라인 확산형', thumbnail:'/images/lights/line_40w.png' },

  /* === T20 마그네틱 — 스타 집중형 === */
  { name:'스타 집중형 등기구 6W', lumenByColorTemp:{'3000K':480,'4000K':480}, watt:6, colorTemps:['3000K','4000K'], size:'W110×D22×H25mm', category:'T20 마그네틱', type:'스타 집중형', thumbnail:'/images/lights/star_6w.png' },
  { name:'스타 집중형 등기구 12W', lumenByColorTemp:{'3000K':960,'4000K':960}, watt:12, colorTemps:['3000K','4000K'], size:'W220×D22×H25mm', category:'T20 마그네틱', type:'스타 집중형', thumbnail:'/images/lights/star_12w.png' },
  { name:'스타 집중형 등기구 18W', lumenByColorTemp:{'3000K':1440,'4000K':1440}, watt:18, colorTemps:['3000K','4000K'], size:'W330×D22×H25mm', category:'T20 마그네틱', type:'스타 집중형', thumbnail:'/images/lights/star_18w.png' },
  { name:'스타 집중형 등기구 24W', lumenByColorTemp:{'3000K':1920,'4000K':1920}, watt:24, colorTemps:['3000K','4000K'], size:'W440×D22×H25mm', category:'T20 마그네틱', type:'스타 집중형', thumbnail:'/images/lights/star_24w.png' },
  { name:'스타 집중형 등기구 30W', lumenByColorTemp:{'3000K':2400,'4000K':2400}, watt:30, colorTemps:['3000K','4000K'], size:'W550×D22×H25mm', category:'T20 마그네틱', type:'스타 집중형', thumbnail:'/images/lights/star_30w.png' },
  { name:'스타 집중형 등기구 36W', lumenByColorTemp:{'3000K':2880,'4000K':2880}, watt:36, colorTemps:['3000K','4000K'], size:'W660×D22×H25mm', category:'T20 마그네틱', type:'스타 집중형', thumbnail:'/images/lights/star_36w.png' },

  /* === T20 마그네틱 — 스타 폴더 집중형 === */
  { name:'스타 폴더 집중형 등기구 6W', lumenByColorTemp:{'3000K':480,'4000K':480}, watt:6, colorTemps:['3000K','4000K'], size:'W112×D22×H136mm', category:'T20 마그네틱', type:'스타 폴더 집중형', thumbnail:'/images/lights/folder_6w.png' },
  { name:'스타 폴더 집중형 등기구 12W', lumenByColorTemp:{'3000K':960,'4000K':960}, watt:12, colorTemps:['3000K','4000K'], size:'W225×D22×H136mm', category:'T20 마그네틱', type:'스타 폴더 집중형', thumbnail:'/images/lights/folder_12w.png' },
  { name:'스타 폴더 집중형 등기구 18W', lumenByColorTemp:{'3000K':1440,'4000K':1440}, watt:18, colorTemps:['3000K','4000K'], size:'W325×D22×H136mm', category:'T20 마그네틱', type:'스타 폴더 집중형', thumbnail:'/images/lights/folder_18w.png' },

  /* === T20 마그네틱 — 스포트 집중형 === */
  { name:'스포트 집중형 등기구 7W', lumenByColorTemp:{'3000K':560,'4000K':560}, watt:7, colorTemps:['3000K','4000K'], size:'W35×H80mm', category:'T20 마그네틱', type:'스포트 집중형', thumbnail:'/images/lights/spot_7w.png' },
  { name:'스포트 집중형 등기구 12W', lumenByColorTemp:{'3000K':960,'4000K':960}, watt:12, colorTemps:['3000K','4000K'], size:'W42×H100mm', category:'T20 마그네틱', type:'스포트 집중형', thumbnail:'/images/lights/spot_12w.png' },
  { name:'스포트 집중형 등기구 20W', lumenByColorTemp:{'3000K':1600,'4000K':1600}, watt:20, colorTemps:['3000K','4000K'], size:'W48×H105mm', category:'T20 마그네틱', type:'스포트 집중형', thumbnail:'/images/lights/spot_20w.png' },

  /* === T20 마그네틱 — ZOOM 스포트 집중형 === */
  { name:'ZOOM 스포트 집중형 등기구 10W', lumenByColorTemp:{'3000K':800,'4000K':800}, watt:10, colorTemps:['3000K','4000K'], size:'W65×H128mm', category:'T20 마그네틱', type:'ZOOM 스포트 집중형', thumbnail:'/images/lights/zoom_10w.png' },
  { name:'ZOOM 스포트 집중형 등기구 20W', lumenByColorTemp:{'3000K':1600,'4000K':1600}, watt:20, colorTemps:['3000K','4000K'], size:'W85×H145mm', category:'T20 마그네틱', type:'ZOOM 스포트 집중형', thumbnail:'/images/lights/zoom_20w.png' },
]

/* ───────── 카테고리 + T20 타입 ───────── */
export const LIGHT_CATEGORIES = [
  '다운라이트',
  '라인조명',
  '레일조명',
  '벌브전구',
  '평판등',
  '간접조명',
  'T20 마그네틱',
] as const

export const T20_TYPES = [
  '라인 확산형',
  '스타 집중형',
  '스타 폴더 집중형',
  '스포트 집중형',
  'ZOOM 스포트 집중형',
] as const

/* ───────── 공간 유형 (목표 조도 + 공간별 MF) ─────────
   MF (보수율): 청소 빈도/오염도에 따른 광속 감소 보정
*/
export const SPACE_TYPES: SpaceType[] = [
  { name:'술집',     lux:150, mf:0.80 },
  { name:'카페',     lux:250, mf:0.80 },
  { name:'밥집',     lux:300, mf:0.80 },
  { name:'주방',     lux:600, mf:0.70 },  // 기름때, 청소 부담
  { name:'침실',     lux:150, mf:0.85 },
  { name:'거실',     lux:250, mf:0.85 },
  { name:'다이닝룸', lux:400, mf:0.80 },
]

export const SPACE_FIRST_ROW  = ['술집','카페','밥집','주방']
export const SPACE_SECOND_ROW = ['침실','거실','다이닝룸']

/* ───────── 인테리어 톤 (UF 보정 계수) ─────────
   F&B는 보통 어두운 톤 매장이 많아 'normal'이 디폴트
*/
export const INTERIOR_TONES: InteriorToneOption[] = [
  { value:'bright', label:'밝음',   desc:'백색 천장+벽',     factor:1.00 },
  { value:'normal', label:'보통',   desc:'베이지/우드',       factor:0.85 },
  { value:'dark',   label:'어두움', desc:'검정/짙은 톤',     factor:0.70 },
]

/* ───────── 커스텀 조명 — 종류별 광효율 (lm/W) ───────── */
export const CUSTOM_LIGHT_TYPES = [
  { value:'매립조명',     label:'매립조명',     desc:'다운라이트, 평판등, 슬림매입등', lmPerW:90 },
  { value:'직부조명',     label:'직부조명',     desc:'COB 원통등, 노출형 실린더',     lmPerW:90 },
  { value:'간접조명',     label:'간접조명',     desc:'T5, 몰딩 안쪽 라인바',          lmPerW:100 },
  { value:'레일조명',     label:'레일조명',     desc:'스포트라이트, 집어등, 줌형',    lmPerW:85 },
  { value:'전구형 조명',  label:'전구형 조명',  desc:'E26 벌브, 팬던트, 샹들리에',    lmPerW:100 },
  { value:'기타',         label:'기타',         desc:'직접 입력',                      lmPerW:80 },
] as const
