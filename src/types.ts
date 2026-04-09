/**
 * nasne-wrapper の型定義
 * エンドポイント名のユニオン型など、API全体で使用する型をまとめる
 */

/** nasne API の全エンドポイント名のユニオン型 */
export type EndpointName =
  // chEpg
  | "channelLogoDataGet"
  | "EPGGet"
  | "EPGStoreStart"
  // cma
  | "connectionOnlineIdGet"
  | "reconstructDatabaseProgressGet"
  // config
  | "NASMetaDataAnalyzeProgressGet"
  // recorded
  | "titleListGet"
  | "recordedContentThumbnailGet"
  // remoteAcces/dr
  | "matchingIdInfoGet"
  | "outdoorClientListGet2"
  | "registerRequestListGet"
  // remoteAcces/sync
  | "registerdFolderNameGetByReceiver"
  | "reservedFolderNameGetByInitiator"
  | "syncDTVTunerListGet_2"
  // schedule
  | "conflictListGet"
  | "reservedInfoBitrateGet"
  | "reservedInfoCreate"
  | "reservedInfoDelete"
  | "reservedListGet"
  // status
  | "areaInfoGet"
  | "BCASInfoGet"
  | "boxNameGet"
  | "boxStatusListGet"
  | "bdPowerSupplyGet"
  | "channelPhysicalInfoGet"
  | "channelPhysicalInfoGetEnd"
  | "channelPhysicalInfoGetStart"
  | "channelInfoGet"
  | "channelInfoGet2"
  | "channelListGet"
  | "currDateGet"
  | "DLNAMediaServerIconGet"
  | "DLNAMediaServerIconListGet"
  | "DMPAutoRegisterInfoGet"
  | "DMPListGet"
  | "downloadingPermissionGet"
  | "dtcpipClientListGet"
  | "EPGVersionInfoGet"
  | "eventRelayInfoGet"
  | "HDDInfoGet"
  | "HDDListGet"
  | "HDDPowerSavingModeGet"
  | "isFinishSetup"
  | "NASInfoGet"
  | "mobileBitrateInfoGet"
  | "networkIfInfoGet"
  | "parentalRatingInfoGet"
  | "parentalRatingPasswordGet"
  | "recNgListGet"
  | "remoteListGet"
  | "requestClientInfoGet"
  | "softwareVersionGet"
  | "TOTStatusGet"
  | "updateCheck"
  | "updateCheck2";

/** getQueryString が返すクエリパラメータの型 */
export type QueryParams = Record<string, string | number> | null;

/** checkEndpoint の結果を表す型 */
export type CheckEndpointResult = {
  /** 200 OK だったエンドポイント */
  success: EndpointName[];
  /** 4xx エラーだったエンドポイント */
  clientError: EndpointName[];
  /** 5xx エラーだったエンドポイント */
  serverError: EndpointName[];
  /** その他のエラーだったエンドポイント */
  unknownError: EndpointName[];
};
