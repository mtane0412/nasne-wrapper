/**
 * Nasne クラスのテスト
 * コンストラクタ・fetch()・checkEndpoint()・formatText() の振る舞いを検証する
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Nasne } from "../src/nasne.js";

/** fetch をモックして指定レスポンスを返すヘルパー */
function mockFetch(body: unknown, status = 200): void {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
}

describe("Nasne コンストラクタ", () => {
  it("IP アドレスを指定するとインスタンスが生成される", () => {
    const nasne = new Nasne("192.168.0.1");
    expect(nasne).toBeInstanceOf(Nasne);
  });

  it("IP アドレスを省略すると TypeError をスローする", () => {
    // @ts-expect-error: 意図的に引数なしで呼び出す
    expect(() => new Nasne()).toThrow(TypeError);
  });

  it("空文字列を渡すと TypeError をスローする", () => {
    expect(() => new Nasne("")).toThrow(TypeError);
  });
});

describe("Nasne#fetch", () => {
  let nasne: Nasne;

  beforeEach(() => {
    nasne = new Nasne("192.168.0.1");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("正常系: レスポンスの JSON データを返す", async () => {
    const データ = { status: "ok", value: 42 };
    mockFetch(データ);

    const result = await nasne.fetch("areaInfoGet");
    expect(result).toEqual(データ);
  });

  it("正常系: fetch に正しい URL が渡される", async () => {
    mockFetch({});
    const spy = vi.spyOn(globalThis, "fetch");

    await nasne.fetch("areaInfoGet");

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("http://192.168.0.1:64210/status/areaInfoGet"),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("正常系: クエリパラメータが URL に付与される", async () => {
    mockFetch({});
    const spy = vi.spyOn(globalThis, "fetch");

    await nasne.fetch("titleListGet");

    const calledUrl = (spy.mock.calls[0]?.[0] as string) ?? "";
    expect(calledUrl).toContain("searchCriteria=0");
    expect(calledUrl).toContain("filter=0");
  });

  it("HTTPエラー: 4xx レスポンスで Error をスローする", async () => {
    mockFetch({ message: "Not Found" }, 404);
    await expect(nasne.fetch("areaInfoGet")).rejects.toThrow("HTTP 404");
  });

  it("HTTPエラー: 5xx レスポンスで Error をスローする", async () => {
    mockFetch({ message: "Internal Server Error" }, 500);
    await expect(nasne.fetch("areaInfoGet")).rejects.toThrow("HTTP 500");
  });

  it("ネットワークエラー: fetch 自体が失敗した場合は例外が伝播する", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ネットワークエラー"));
    await expect(nasne.fetch("areaInfoGet")).rejects.toThrow("ネットワークエラー");
  });

  it("正常系: Content-Type が text/plain の場合はテキストを返す", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("プレーンテキストデータ", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      })
    );
    const result = await nasne.fetch("areaInfoGet");
    expect(result).toBe("プレーンテキストデータ");
  });

  it("正常系: Content-Type が image/jpeg の場合は ArrayBuffer を返す", async () => {
    const バイナリデータ = new Uint8Array([1, 2, 3, 4]).buffer;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(バイナリデータ, {
        status: 200,
        headers: { "Content-Type": "image/jpeg" },
      })
    );
    const result = await nasne.fetch("recordedContentThumbnailGet");
    expect(result).toBeInstanceOf(ArrayBuffer);
  });
});

describe("Nasne#checkEndpoint", () => {
  let nasne: Nasne;

  beforeEach(() => {
    nasne = new Nasne("192.168.0.1");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("全エンドポイントをチェックし結果オブジェクトを返す", async () => {
    mockFetch({ status: "ok" });

    const result = await nasne.checkEndpoint();

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("clientError");
    expect(result).toHaveProperty("serverError");
    expect(result).toHaveProperty("unknownError");
  });

  it("正常系: 200 OK のエンドポイントは success に入る", async () => {
    mockFetch({ status: "ok" });

    const result = await nasne.checkEndpoint();

    expect(result.success.length).toBeGreaterThan(0);
    expect(result.clientError.length).toBe(0);
    expect(result.serverError.length).toBe(0);
  });

  it("4xx エラーのエンドポイントは clientError に入る", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 400 })
    );

    const result = await nasne.checkEndpoint();

    expect(result.clientError.length).toBeGreaterThan(0);
    expect(result.success.length).toBe(0);
  });

  it("5xx エラーのエンドポイントは serverError に入る", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 })
    );

    const result = await nasne.checkEndpoint();

    expect(result.serverError.length).toBeGreaterThan(0);
    expect(result.success.length).toBe(0);
  });

  it("個別エンドポイントをチェックし結果オブジェクトを返す", async () => {
    mockFetch({ status: "ok" });

    const result = await nasne.checkEndpoint("areaInfoGet");

    expect(result.success).toContain("areaInfoGet");
  });

  it("200 OK でも本文が空のエンドポイントは success に入る（ステータスのみ判定）", async () => {
    // 本文が空の場合 response.json() は SyntaxError をスローするが、
    // checkEndpoint はステータスコードのみで判定するため success に入る
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const result = await nasne.checkEndpoint("areaInfoGet");
    expect(result.success).toContain("areaInfoGet");
  });

  it("4xx レスポンスは本文を読まずに clientError に分類される", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("", { status: 404 })
    );
    const result = await nasne.checkEndpoint("areaInfoGet");
    expect(result.clientError).toContain("areaInfoGet");
  });
});

describe("Nasne#formatText", () => {
  it("特殊文字を変換した文字列を返す", () => {
    const nasne = new Nasne("192.168.0.1");
    expect(nasne.formatText("\uE195ドラマ")).toBe("[終]ドラマ");
  });
});
