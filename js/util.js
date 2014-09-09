/**
 * return The luminance Y calculated from the RGB values.
 * @param R float red
 * @param G float green
 * @param B float blue
 * @returns luminance
 */
var calcYFromRgb = function(R, G, B) {
    return Math.round(0.299 * R + 0.587 * G + 0.114 * B);
};