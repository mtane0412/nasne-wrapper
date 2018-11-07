module.exports = function getQueryString(method, supplementary) {
    let queryString;
    switch (method) {
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
            if (!supplementary) {
                queryString = {
                    id: '0'
                }
            } else if (supplementary == 0 || supplementary == 1) {
                queryString = {
                    id: String(supplementary)
                }
            } else {
                throw new Error(`${supplementary} は不正な引数です。\n 0: 内蔵HDD(デフォルト) \n 1: 外付けHDD`);
            }
            break;
        default:
            queryString = null;
            break;
    }
    return queryString;
}