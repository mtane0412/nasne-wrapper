'use strict'
const endpoints = [{
        path: 'chEpg',
        endpoint: [
            'channelLogoDataGet',
            'EPGGet',
            'EPGStoreStart'
        ]
    },
    {
        path: 'cma',
        endpoint: [
            'connectionOnlineIdGet',
            'reconstructDatabaseProgressGet'
        ]
    },
    {
        path: 'config',
        endpoint: [
            'reconstructDatabaseProgressGet',
            'NASMetaDataAnalyzeProgressGet'
        ]
    },
    {
        path: 'recorded',
        endpoint: [
            'titleListGet',
            'recordedContentThumbnailGet'
        ]
    },
    {
        path: 'remoteAcces/dr',
        endpoint: [
            'matchingIdInfoGet',
            'outdoorClientListGet2',
            'registerRequestListGet'
        ]
    },
    {
        path: 'remoteAcces/sync',
        endpoint: [
            'registerdFolderNameGetByReceiver',
            'reservedFolderNameGetByInitiator',
            'syncDTVTunerListGet_2'
        ]
    },
    {
        path: 'schedule',
        endpoint: [
            'conflictListGet',
            'reservedInfoBitrateGet',
            'reservedInfoCreate',
            'reservedInfoDelete',
            'reservedListGet'
        ]
    }
];

const findPath = (endpoint) => {
    let path;
    endpoints.find(el => {
        if (el.endpoint.indexOf(endpoint) !== -1) path = el.path;
    })
    return path ? path : 'status';
}


const getUrl = (endpoint, ip) => {
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

module.exports = getUrl;