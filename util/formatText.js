'use strict'

/**
 * nasneの特殊文字を読みやすい形式に変換する
 * @param {string} text - 変換する文字列（通常はJSONデータ）
 * @returns {string} 変換後の文字列
 */
const formatText = (text) => {
    return text
        .replace(/\ue195/g, "[終]")
        .replace(/\ue193/g, "[新]")
        .replace(/\ue0fe/g, "[字]")
        .replace(/\uE184/g, "[解]")
        .replace(/\uE183/g, "[多]")
        .replace(/\uE180/g, "[デ]");
}

module.exports = formatText;
