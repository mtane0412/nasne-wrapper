/**
 * nasne 特殊文字変換
 *
 * nasne が JSON データ内で返す Private Use Area の Unicode 文字を、
 * 人間が読める日本語表記（例: [終], [新]）に変換する。
 */

/** nasne の特殊文字と変換後テキストのマッピング */
const SPECIAL_CHAR_MAP: ReadonlyArray<[RegExp, string]> = [
  [/\uE195/g, "[終]"],
  [/\uE193/g, "[新]"],
  [/\uE0FE/g, "[字]"],
  [/\uE184/g, "[解]"],
  [/\uE183/g, "[多]"],
  [/\uE180/g, "[デ]"],
];

/**
 * nasne の特殊文字を読みやすい形式に変換する
 *
 * @param text - 変換する文字列（通常は nasne API のレスポンス JSON）
 * @returns 特殊文字を日本語表記に置換した文字列
 */
export const formatText = (text: string): string =>
  SPECIAL_CHAR_MAP.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
