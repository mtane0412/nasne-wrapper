const methods = {
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

function findPath(method) {
    for (let key in methods) {
        if (methods[key].indexOf(method) != -1) {
            return key.replace('_', '/');
        }
    }
    return 'status';
}


module.exports = function getUrl(method, ip) {
    const nasneIP = ip;
    let path = findPath(method);
    if (path === 'schedule' || method === 'titleListGet') {
        port = '64220';
    } else {
        port = '64210';
    }
    return `http://${nasneIP}:${port}/${path}/${method}`
}