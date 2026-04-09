/**
 * Nasne クラス
 *
 * nasne（ソニーのネットワークレコーダー）の HTTP API を操作するためのラッパー。
 * Node.js 20+ のネイティブ fetch API を使用する（axios 不使用）。
 *
 * @example
 * ```ts
 * import { Nasne } from 'nasne-wrapper';
 * const nasne = new Nasne('192.168.0.1');
 * const data = await nasne.fetch('areaInfoGet');
 * ```
 */

import { REQUEST_TIMEOUT_MS } from "./constants.js";
import { ALL_ENDPOINTS, getQueryString, getUrl } from "./endpoints.js";
import { formatText as doFormatText } from "./format-text.js";
import type {
  CheckEndpointResult,
  EndpointName,
  QueryParams,
} from "./types.js";

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
   * URL を組み立てるヘルパー（fetch / fetchStatus の共通処理）
   *
   * @param endpoint - API エンドポイント名
   * @param option - HDD 選択オプション
   * @returns 組み立て済みの URL 文字列
   */
  private buildUrl(endpoint: EndpointName, option: number): string {
    const baseUrl = getUrl(endpoint, this.ip);
    const queryParams: QueryParams = getQueryString(endpoint, option);
    if (queryParams === null) return baseUrl;
    return `${baseUrl}?${new URLSearchParams(
      Object.entries(queryParams).map(([k, v]) => [k, String(v)]),
    ).toString()}`;
  }

  /**
   * nasne API にリクエストを送信し、レスポンスデータを返す
   *
   * Content-Type に応じてパース方式を切り替える：
   * - `application/json` → JSON オブジェクト
   * - `text/*` → 文字列
   * - その他 → ArrayBuffer（画像・バイナリ用途）
   *
   * @param endpoint - 呼び出す API エンドポイント名
   * @param option - HDDInfoGet の場合の HDD 選択（0: 内蔵, 1: 外付け）
   * @returns レスポンスのパース済みデータ
   * @throws {Error} HTTP エラー（4xx/5xx）またはネットワークエラーの場合
   */
  async fetch(endpoint: EndpointName, option: number = 0): Promise<unknown> {
    const url = this.buildUrl(endpoint, option);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Content-Type に応じてパース方式を選択する
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    if (contentType.startsWith("text/")) {
      return response.text();
    }
    return response.arrayBuffer();
  }

  /**
   * HTTP ステータスコードのみを返す内部リクエストメソッド
   *
   * checkEndpoint での疎通確認に使用する。
   * レスポンス本文は読まないため、JSON でないレスポンスでもエラーにならない。
   *
   * @param endpoint - API エンドポイント名
   * @param option - HDD 選択オプション
   * @returns HTTP ステータスコード
   */
  private async fetchStatus(
    endpoint: EndpointName,
    option: number = 0,
  ): Promise<number> {
    const url = this.buildUrl(endpoint, option);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    return response.status;
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

    const targets: readonly EndpointName[] = endpoint
      ? [endpoint]
      : ALL_ENDPOINTS;

    // 全エンドポイントを並列に確認する（ステータスコードのみ判定・本文は読まない）
    const settled = await Promise.allSettled(
      targets.map((ep) =>
        this.fetchStatus(ep).then((status) => ({ ep, status })),
      ),
    );

    for (const outcome of settled) {
      if (outcome.status === "fulfilled") {
        const { ep, status } = outcome.value;
        if (status >= 200 && status < 300) {
          result.success.push(ep);
        } else if (status >= 400 && status < 500) {
          result.clientError.push(ep);
        } else if (status >= 500 && status < 600) {
          result.serverError.push(ep);
        } else {
          result.unknownError.push(ep);
        }
      } else {
        // ネットワークエラー等でステータスコード自体が取れない場合
        // settled と targets は同順なので index で対応付ける
        // （AbortError・接続拒否など）→ unknownError に分類する
        // NOTE: settled の index と targets の対応は保証されているが、
        //       ep を特定できないため targets から再取得する
        const idx = settled.indexOf(outcome);
        const ep = targets[idx];
        if (ep !== undefined) {
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
