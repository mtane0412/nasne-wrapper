'use strict'
const endpoints = {
    chEpg: [
        'channelLogoDataGet',
        'EPGGet',
        'EPGStoreStart'
    ],
    cma: [
        'connectionOnlineIdGet',
        'reconstructDatabaseProgressGet'
    ],
    config: [
        'reconstructDatabaseProgressGet',
        'NASMetaDataAnalyzeProgressGet'
    ],
    recorded: [
        'titleListGet',
        'recordedContentThumbnailGet'
    ],
    remoteAccess_dr: [
        'matchingIdInfoGet',
        'outdoorClientListGet2',
        'registerRequestListGet'
    ],
    remoteAccess_sync: [
        'registerdFolderNameGetByReceiver',
        'reservedFolderNameGetByInitiator',
        'syncDTVTunerListGet_2'
    ],
    schedule: [
        'conflictListGet',
        'reservedInfoBitrateGet',
        'reservedInfoCreate',
        'reservedInfoDelete',
        'reservedListGet'
    ]
}

function findPath(endpoint) {
    for (let key in endpoints) {
        if (endpoints[key].indexOf(endpoint) != -1) {
            return key.replace('_', '/');
        }
    }
    return 'status';
}


module.exports = function getUrl(endpoint, ip) {
    const nasneIP = ip;
    let port;
    let path = findPath(endpoint);
    if (path === 'schedule' || endpoint === 'titleListGet') {
        port = '64220';
    } else {
        port = '64210';
    }
    return `http://${nasneIP}:${port}/${path}/${endpoint}`
}