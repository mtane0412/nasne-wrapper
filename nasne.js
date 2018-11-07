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

// schedule
require('./nasne/titleListGet')(Nasne);
require('./nasne/reservedListGet')(Nasne);

// status
require('./nasne/HDDInfoGet')(Nasne);
require('./nasne/HDDListGet')(Nasne);
require('./nasne/boxNameGet')(Nasne);
require('./nasne/currDateGet')(Nasne);
require('./nasne/HDDPowerSavingModeGet')(Nasne);
require('./nasne/areaInfoGet')(Nasne);
require('./nasne/networkInfoGet')(Nasne);
require('./nasne/softwareVersionGet')(Nasne);
require('./nasne/NASInfoGet')(Nasne);
require('./nasne/requestClientInfoGet')(Nasne);
require('./nasne/DMPListGet')(Nasne);
require('./nasne/remoteListGet')(Nasne);
require('./nasne/BCASInfoGet')(Nasne);
require('./nasne/bsPowerSupplyGet')(Nasne);
require('./nasne/downloadingPermissionGet')(Nasne);
require('./nasne/eventRelayInfoGet')(Nasne);
require('./nasne/parentalRatingInfoGet')(Nasne);
require('./nasne/hardwareVersionGet')(Nasne);
require('./nasne/mobileBitrateInfoGet')(Nasne);
require('./nasne/updateCheck2')(Nasne);
require('./nasne/boxStatusListGet')(Nasne);

module.exports = Nasne;