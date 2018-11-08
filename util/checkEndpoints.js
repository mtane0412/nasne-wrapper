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


module.exports = function checkEndpoints(Nasne) {
    const self = Nasne;

    const result = {
        total: 0,
        normalRes: 0,
        normalResEndpoints: [],
        noRes: 0,
        noResEndpoints: []
    };
    const responsesPromise = [];
    const fetchPromise = (endpoint) => {
        return new Promise((resolve) => {
            self.fetch(endpoint, resolve);
        })
    }

    for (let endpoint of endpoints) {
        responsesPromise.push(fetchPromise(endpoint));
    }

    Promise.all(responsesPromise)
        .then((responsesPromise) => {
            const responses = (responsesPromise);
            result.total = responses.length;

            for (let i in responses) {
                if (!responses[i].body) {
                    result.noRes++;
                    result.noResEndpoints.push(responses[i].dataType);
                } else {
                    result.normalRes++;
                    result.normalResEndpoints.push(responses[i].dataType);
                }
            }

            return result;
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })
}