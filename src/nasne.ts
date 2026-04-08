/**
 * Nasne クラス
 *
 * nasne（ソニーのネットワークレコーダー）の HTTP API を操作するためのラッパー。
 * Node.js 18+ のネイティブ fetch API を使用する（axios 不使用）。
 *
 * @example
 * ```ts
 * import { Nasne } from 'nasne-wrapper';
 * const nasne = new Nasne('192.168.0.1');
 * const data = await nasne.fetch('areaInfoGet');
 * ```
 */

import { getUrl, getQueryString, ALL_ENDPOINTS } from "./endpoints.js";
import { formatText as doFormatText } from "./format-text.js";
import { REQUEST_TIMEOUT_MS } from "./constants.js";
import type { EndpointName, CheckEndpointResult, QueryParams } from "./types.js";

export class Nasne {
  /** nasne 本体の IP アドレス */
  private readonly ip: string;

  /**
   * @param ip - nasne 本体の IP アドレス（例: "192.168.0.1"）
   * @throws {TypeError} IP アドレスが未指定または空文字の場合
   */
  constructor(ip: string) {
    if (!ip) {
      throw new TypeError("nasne の IP アドレスを指定してください");
    }
    this.ip = ip;
  }

  /**
   * nasne API にリクエストを送信し、レスポンスデータを返す
   *
   * @param endpoint - 呼び出す API エンドポイント名
   * @param option - HDDInfoGet の場合の HDD 選択（0: 内蔵, 1: 外付け）
   * @returns レスポンス JSON の内容
   * @throws {Error} HTTP エラー（4xx/5xx）またはネットワークエラーの場合
   */
  async fetch(endpoint: EndpointName, option = 0): Promise<unknown> {
    const baseUrl = getUrl(endpoint, this.ip);
    const queryParams: QueryParams = getQueryString(endpoint, option);

    // クエリパラメータがある場合は URL に付与する
    const url =
      queryParams !== null
        ? `${baseUrl}?${new URLSearchParams(
            Object.entries(queryParams).map(([k, v]) => [k, String(v)])
          ).toString()}`
        : baseUrl;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * エンドポイントの疎通確認を行う
   *
   * 引数を省略すると全エンドポイントを並列チェックする。
   * 旧実装のバグ（await なし・return なし）を修正し、Promise.allSettled で並列実行する。
   *
   * @param endpoint - チェック対象エンドポイント（省略時は全エンドポイントをチェック）
   * @returns チェック結果（success / clientError / serverError / unknownError の分類）
   */
  async checkEndpoint(endpoint?: EndpointName): Promise<CheckEndpointResult> {
    const result: CheckEndpointResult = {
      success: [],
      clientError: [],
      serverError: [],
      unknownError: [],
    };

    const targets: readonly EndpointName[] = endpoint ? [endpoint] : ALL_ENDPOINTS;

    // 全エンドポイントを並列に確認する
    const settled = await Promise.allSettled(
      targets.map((ep) => this.fetch(ep).then(() => ep))
    );

    for (let i = 0; i < settled.length; i++) {
      const ep = targets[i];
      const outcome = settled[i];
      // targets と settled は同長なので必ず存在する
      if (ep === undefined || outcome === undefined) continue;

      if (outcome.status === "fulfilled") {
        result.success.push(ep);
      } else {
        const message: string =
          outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason);
        // "HTTP 400" のようなメッセージからステータスコードを抽出する
        const match = /HTTP (\d+)/.exec(message);
        const statusCode = match ? parseInt(match[1] ?? "0", 10) : 0;

        if (statusCode >= 400 && statusCode < 500) {
          result.clientError.push(ep);
        } else if (statusCode >= 500 && statusCode < 600) {
          result.serverError.push(ep);
        } else {
          result.unknownError.push(ep);
        }
      }
    }

    return result;
  }

  /**
   * nasne の特殊文字を読みやすい形式に変換する
   *
   * @param text - 変換する文字列（通常は nasne API のレスポンス JSON）
   * @returns 特殊文字を日本語表記に置換した文字列
   */
  formatText(text: string): string {
    return doFormatText(text);
  }
}
