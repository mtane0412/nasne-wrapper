/**
 * エンドポイント定義・URL構築・クエリ文字列構築のテスト
 */
import { describe, it, expect } from "vitest";
import { getUrl, getQueryString, ALL_ENDPOINTS } from "../src/endpoints.js";

describe("getUrl", () => {
  const ip = "192.168.0.1";

  describe("パスのルーティング", () => {
    it("chEpg 配下のエンドポイントは /chEpg/ パスになる", () => {
      expect(getUrl("EPGGet", ip)).toBe("http://192.168.0.1:64210/chEpg/EPGGet");
    });

    it("cma 配下のエンドポイントは /cma/ パスになる", () => {
      expect(getUrl("connectionOnlineIdGet", ip)).toBe(
        "http://192.168.0.1:64210/cma/connectionOnlineIdGet"
      );
    });

    it("config 配下のエンドポイントは /config/ パスになる", () => {
      expect(getUrl("NASMetaDataAnalyzeProgressGet", ip)).toBe(
        "http://192.168.0.1:64210/config/NASMetaDataAnalyzeProgressGet"
      );
    });

    it("recorded 配下のエンドポイントは /recorded/ パスになる", () => {
      expect(getUrl("recordedContentThumbnailGet", ip)).toBe(
        "http://192.168.0.1:64210/recorded/recordedContentThumbnailGet"
      );
    });

    it("remoteAcces/dr 配下のエンドポイントは /remoteAcces/dr/ パスになる", () => {
      expect(getUrl("matchingIdInfoGet", ip)).toBe(
        "http://192.168.0.1:64210/remoteAcces/dr/matchingIdInfoGet"
      );
    });

    it("remoteAcces/sync 配下のエンドポイントは /remoteAcces/sync/ パスになる", () => {
      expect(getUrl("syncDTVTunerListGet_2", ip)).toBe(
        "http://192.168.0.1:64210/remoteAcces/sync/syncDTVTunerListGet_2"
      );
    });

    it("schedule 配下のエンドポイントは /schedule/ パスになる", () => {
      expect(getUrl("conflictListGet", ip)).toBe(
        "http://192.168.0.1:64220/schedule/conflictListGet"
      );
    });

    it("どのカテゴリにも属さないエンドポイントは /status/ パスになる", () => {
      expect(getUrl("areaInfoGet", ip)).toBe(
        "http://192.168.0.1:64210/status/areaInfoGet"
      );
    });
  });

  describe("ポート番号の振り分け", () => {
    it("schedule 配下のエンドポイントはポート 64220 を使用する", () => {
      expect(getUrl("reservedListGet", ip)).toContain(":64220/");
    });

    it("titleListGet はポート 64220 を使用する", () => {
      expect(getUrl("titleListGet", ip)).toBe(
        "http://192.168.0.1:64220/recorded/titleListGet"
      );
    });

    it("その他のエンドポイントはポート 64210 を使用する", () => {
      expect(getUrl("HDDInfoGet", ip)).toContain(":64210/");
    });
  });
});

describe("getQueryString", () => {
  describe("titleListGet / reservedListGet", () => {
    it("titleListGet は標準的な検索パラメータを返す", () => {
      expect(getQueryString("titleListGet")).toEqual({
        searchCriteria: 0,
        filter: 0,
        startingIndex: 0,
        requestedCount: 0,
        sortCriteria: 0,
        withDescriptionLong: 1,
        withUserData: 0,
      });
    });

    it("reservedListGet は標準的な検索パラメータを返す", () => {
      expect(getQueryString("reservedListGet")).toEqual({
        searchCriteria: 0,
        filter: 0,
        startingIndex: 0,
        requestedCount: 0,
        sortCriteria: 0,
        withDescriptionLong: 1,
        withUserData: 0,
      });
    });
  });

  describe("HDDInfoGet", () => {
    it("option=0 のとき id='0' を返す（内蔵HDD）", () => {
      expect(getQueryString("HDDInfoGet", 0)).toEqual({ id: "0" });
    });

    it("option=1 のとき id='1' を返す（外付けHDD）", () => {
      expect(getQueryString("HDDInfoGet", 1)).toEqual({ id: "1" });
    });

    it("option が 0/1 以外のとき TypeError をスローする", () => {
      expect(() => getQueryString("HDDInfoGet", 2)).toThrow(TypeError);
    });

    it("option 未指定のとき id='0' を返す（デフォルト：内蔵HDD）", () => {
      expect(getQueryString("HDDInfoGet")).toEqual({ id: "0" });
    });
  });

  describe("その他のエンドポイント", () => {
    it("パラメータが不要なエンドポイントは null を返す", () => {
      expect(getQueryString("areaInfoGet")).toBeNull();
    });
  });
});

describe("ALL_ENDPOINTS", () => {
  it("配列であること", () => {
    expect(Array.isArray(ALL_ENDPOINTS)).toBe(true);
  });

  it("1件以上のエンドポイントが含まれること", () => {
    expect(ALL_ENDPOINTS.length).toBeGreaterThan(0);
  });

  it("重複が存在しないこと", () => {
    const unique = new Set(ALL_ENDPOINTS);
    expect(unique.size).toBe(ALL_ENDPOINTS.length);
  });

  it("既知のエンドポイントが含まれること", () => {
    expect(ALL_ENDPOINTS).toContain("EPGGet");
    expect(ALL_ENDPOINTS).toContain("titleListGet");
    expect(ALL_ENDPOINTS).toContain("HDDInfoGet");
    expect(ALL_ENDPOINTS).toContain("areaInfoGet");
  });
});
