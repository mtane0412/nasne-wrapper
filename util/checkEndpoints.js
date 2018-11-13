'use strict'

const endpoints = [
    'channelLogoDataGet',
    'EPGGet',
    'EPGStoreStart',
    'connectionOnlineIdGet',
    'reconstructDatabaseProgressGet',
    'reconstructDatabaseProgressGet',
    'NASMetaDataAnalyzeProgressGet',
    'titleListGet',
    'recordedContentThumbnailGet',
    'matchingIdInfoGet',
    'outdoorClientListGet2',
    'registerRequestListGet',
    'registerdFolderNameGetByReceiver',
    'reservedFolderNameGetByInitiator',
    'syncDTVTunerListGet_2',
    'conflictListGet',
    'reservedInfoBitrateGet',
    'reservedInfoCreate',
    'reservedInfoDelete',
    'reservedListGet',
    'areaInfoGet',
    'BCASInfoGet',
    'boxNameGet',
    'boxStatusListGet',
    'bdPowerSupplyGet',
    'channelPhysicalInfoGet',
    'channelPhysicalInfoGetEnd',
    'channelPhysicalInfoGetStart',
    'channelInfoGet',
    'channelInfoGet2',
    'channelListGet',
    'currDateGet',
    'DLNAMediaServerIconGet',
    'DLNAMediaServerIconListGet',
    'DMPAutoRegisterInfoGet',
    'DMPListGet',
    'downloadingPermissionGet',
    'dtcpipClientListGet',
    'EPGVersionInfoGet',
    'eventRelayInfoGet',
    'HDDInfoGet',
    'HDDListGet',
    'HDDPowerSavingModeGet',
    'isFinishSetup',
    'NASInfoGet',
    'mobileBitrateInfoGet',
    'networkIfInfoGet',
    'parentalRatingInfoGet',
    'parentalRatingPasswordGet',
    'recNgListGet',
    'remoteListGet',
    'requestClientInfoGet',
    'softwareVersionGet',
    'TOTStatusGet',
    'updateCheck',
    'updateCheck2'
]


const checkEndpoints = (Nasne, endpoint) => {
    const self = Nasne;
    const result = {
        success: [],
        clientError: [],
        serverError: [],
        unknownError: []
    };
    // 引数のエンドポイントをチェック
    if (endpoint) {
        self.fetch(endpoint)
            .then((body) => {
                console.log(`200 - ${endpoint}`);
            })
            .catch(error => {
                console.log(`${error.statusCode} - ${endpoint}`);
            })
        return;
    }

    // 全チェック
    for (let endpoint of endpoints) {
        self.fetch(endpoint)
            .then((body) => {
                result.success.push(endpoint);
                console.log(`200 - ${endpoint}`);
            })
            .catch(error => {
                switch (error.statusCode) {
                    case 400:
                        result.clientError.push(endpoint);
                        break;
                    case 500:
                        result.serverError.push(endpoints);
                        break;
                    default:
                        result.unknownError.push(endpoints);
                        break;
                }
                console.log(`${error.statusCode} - ${endpoint}`);
            })
    }
}

module.exports = checkEndpoints;