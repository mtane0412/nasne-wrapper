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


const checkEndpoint = (Nasne, endpoint) => {
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
            .then(() => {
                console.log(`200 - ${endpoint}`);
            })
            .catch(error => {
                const statusCode = error.response?.status || 500;
                console.log(`${statusCode} - ${endpoint}`);
            })
        return;
    }

    // 全チェック
    for (let endpoint of endpoints) {
        self.fetch(endpoint)
            .then(() => {
                result.success.push(endpoint);
                console.log(`200 - ${endpoint}`);
            })
            .catch(error => {
                const statusCode = error.response?.status || 500;
                switch (statusCode) {
                    case 400:
                        result.clientError.push(endpoint);
                        break;
                    case 500:
                        result.serverError.push(endpoint);
                        break;
                    default:
                        result.unknownError.push(endpoint);
                        break;
                }
                console.log(`${statusCode} - ${endpoint}`);
            })
    }
}

module.exports = checkEndpoint;
