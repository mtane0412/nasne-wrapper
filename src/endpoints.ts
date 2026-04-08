/**
 * nasne API エンドポイント定義・URL構築・クエリパラメータ構築
 *
 * エンドポイント名 → パス/ポートのマッピング、クエリパラメータの構築を一元管理する。
 * 旧実装では util/getUrl.js, util/getQueryString.js, util/checkEndpoint.js に
 * 分散していたが、このファイルに統合した。
 *
 * 注意: nasne API 側の仕様として、パスに `remoteAcces`（s が1つ）という
 * 表記が使われている。タイポではない。
 */

import { PORT } from "./constants.js";
import type { EndpointName, QueryParams } from "./types.js";

/** パスとエンドポイント名のマッピング定義 */
const ENDPOINT_PATH_MAP = [
  { path: "chEpg", endpoints: ["channelLogoDataGet", "EPGGet", "EPGStoreStart"] },
  { path: "cma", endpoints: ["connectionOnlineIdGet", "reconstructDatabaseProgressGet"] },
  { path: "config", endpoints: ["NASMetaDataAnalyzeProgressGet"] },
  { path: "recorded", endpoints: ["titleListGet", "recordedContentThumbnailGet"] },
  {
    path: "remoteAcces/dr",
    endpoints: ["matchingIdInfoGet", "outdoorClientListGet2", "registerRequestListGet"],
  },
  {
    path: "remoteAcces/sync",
    endpoints: [
      "registerdFolderNameGetByReceiver",
      "reservedFolderNameGetByInitiator",
      "syncDTVTunerListGet_2",
    ],
  },
  {
    path: "schedule",
    endpoints: [
      "conflictListGet",
      "reservedInfoBitrateGet",
      "reservedInfoCreate",
      "reservedInfoDelete",
      "reservedListGet",
    ],
  },
] as const;

/** status 配下のエンドポイント一覧 */
const STATUS_ENDPOINTS: EndpointName[] = [
  "areaInfoGet",
  "BCASInfoGet",
  "boxNameGet",
  "boxStatusListGet",
  "bdPowerSupplyGet",
  "channelPhysicalInfoGet",
  "channelPhysicalInfoGetEnd",
  "channelPhysicalInfoGetStart",
  "channelInfoGet",
  "channelInfoGet2",
  "channelListGet",
  "currDateGet",
  "DLNAMediaServerIconGet",
  "DLNAMediaServerIconListGet",
  "DMPAutoRegisterInfoGet",
  "DMPListGet",
  "downloadingPermissionGet",
  "dtcpipClientListGet",
  "EPGVersionInfoGet",
  "eventRelayInfoGet",
  "HDDInfoGet",
  "HDDListGet",
  "HDDPowerSavingModeGet",
  "isFinishSetup",
  "NASInfoGet",
  "mobileBitrateInfoGet",
  "networkIfInfoGet",
  "parentalRatingInfoGet",
  "parentalRatingPasswordGet",
  "recNgListGet",
  "remoteListGet",
  "requestClientInfoGet",
  "softwareVersionGet",
  "TOTStatusGet",
  "updateCheck",
  "updateCheck2",
];

/**
 * エンドポイント名から URL を構築する
 *
 * @param endpoint - nasne API のエンドポイント名
 * @param ip - nasne 本体の IP アドレス
 * @returns 構築した URL 文字列
 */
export const getUrl = (endpoint: EndpointName, ip: string): string => {
  // マッピングテーブルからパスを解決する
  const found = ENDPOINT_PATH_MAP.find((entry) =>
    (entry.endpoints as readonly string[]).includes(endpoint)
  );
  const path = found ? found.path : "status";

  // schedule パスまたは titleListGet はポート 64220 を使用する
  const port = path === "schedule" || endpoint === "titleListGet" ? PORT.SCHEDULE : PORT.DEFAULT;

  return `http://${ip}:${port}/${path}/${endpoint}`;
};

/** titleListGet / reservedListGet で使用する標準クエリパラメータ */
const LIST_QUERY_PARAMS = {
  searchCriteria: 0,
  filter: 0,
  startingIndex: 0,
  requestedCount: 0,
  sortCriteria: 0,
  withDescriptionLong: 1,
  withUserData: 0,
} as const;

/**
 * エンドポイント名からクエリパラメータを構築する
 *
 * @param endpoint - nasne API のエンドポイント名
 * @param option - HDDInfoGet の場合のHDD選択（0: 内蔵HDD, 1: 外付けHDD）
 * @returns クエリパラメータのオブジェクト、不要な場合は null
 * @throws {TypeError} HDDInfoGet で option が 0/1 以外の場合
 */
export const getQueryString = (endpoint: EndpointName, option = 0): QueryParams => {
  switch (endpoint) {
    case "titleListGet":
    case "reservedListGet":
      return { ...LIST_QUERY_PARAMS };
    case "HDDInfoGet":
      if (option !== 0 && option !== 1) {
        throw new TypeError(
          `${option} は不正な引数です。\n 0: 内蔵HDD（デフォルト）\n 1: 外付けHDD`
        );
      }
      return { id: String(option) };
    default:
      return null;
  }
};

/**
 * 全エンドポイント名のリスト（重複なし）
 * checkEndpoint メソッドで全エンドポイントを検査する際に使用する
 */
export const ALL_ENDPOINTS: readonly EndpointName[] = [
  ...ENDPOINT_PATH_MAP.flatMap((entry) => [...entry.endpoints] as EndpointName[]),
  ...STATUS_ENDPOINTS,
];
