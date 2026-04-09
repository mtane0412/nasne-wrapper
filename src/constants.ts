/**
 * nasne API で使用する定数定義
 * ポート番号・タイムアウト値など、ハードコードを避けるための定数をまとめる
 */

/** nasne API のポート番号 */
export const PORT = {
  /** 通常エンドポイント用ポート */
  DEFAULT: 64210,
  /** スケジュール・録画リスト用ポート */
  SCHEDULE: 64220,
} as const;

/** HTTP リクエストのタイムアウト時間（ミリ秒） */
export const REQUEST_TIMEOUT_MS = 10_000;
