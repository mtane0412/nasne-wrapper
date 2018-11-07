'use strict'

class Nasne {
    constructor(ip) {
        if (!ip) {
            throw new Error("nasneのIPアドレスが必要です。");
        };
        this.ip = ip;
        process.env.NASNE_IP = ip;
    }

    getIP() {
        console.log(this.ip);
        return this.ip;
    }
}

require('./titleListGet')(Nasne);
require('./HDDInfoGet')(Nasne);
require('./boxNameGet')(Nasne);
require('./currDateGet')(Nasne);
require('./HDDPowerSavingModeGet')(Nasne);
require('./areaInfoGet')(Nasne);
require('./networkInfoGet')(Nasne);
require('./softwareVersionGet')(Nasne);
require('./NASInfoGet')(Nasne);
require('./requestClientInfoGet')(Nasne);
require('./DMPListGet')(Nasne);
require('./remoteListGet')(Nasne);
require('./BCASInfoGet')(Nasne);
require('./bsPowerSupplyGet')(Nasne);
require('./downloadingPermissionGet')(Nasne);
require('./eventRelayInfoGet')(Nasne);
require('./parentalRatingInfoGet')(Nasne);
require('./hardwareVersionGet')(Nasne);
require('./mobileBitrateInfoGet')(Nasne);
require('./updateCheck2')(Nasne);
require('./boxStatusListGet')(Nasne);

module.exports = Nasne;