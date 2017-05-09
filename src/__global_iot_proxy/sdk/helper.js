/**
 * @module helper
 * @private
 */

/**
 * 用于判断是否桌面测试环境
 * @function isDesktopEnv
 * @returns {boolean}
 */
export function isDesktopEnv() {
    return location.search.indexOf('env=desktop') > -1;
}