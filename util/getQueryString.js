'use strict'

const getQueryString = (endpoint, option) => {
    let queryString = {};
    switch (endpoint) {
        case 'titleListGet':
        case 'reservedListGet':
            queryString = {
                searchCriteria: 0,
                filter: 0,
                startingIndex: 0,
                requestedCount: 0,
                sortCriteria: 0,
                withDescriptionLong: 1,
                withUserData: 0
            }
            break;
        case 'HDDInfoGet':
            if (option === 0 || option === 1 || option === "0" || option === "1") {
                queryString.id = String(option);
            } else {
                throw TypeError(`${option} は不正な引数です。\n 0: 内蔵HDD(デフォルト) \n 1: 外付けHDD`);
            }
            break;
        default:
            queryString = null;
            break;
    }
    return queryString;
}

module.exports = getQueryString;