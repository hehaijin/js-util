'use strict';

/**
 * only returns true when the input is all Upper case characters.
 * @param {} input 
 */
function isUpperCase(input) {
    return /^[A-Z]*$/.test(input);
}

function isLowerCase(input) {
    return /^[a-z]*$/.test(input);
}

function isAlphaNumeric(input) {
    return /^[a-zA-Z0-9]*$/.test(input);
}


exports.isUpperCase = isUpperCase;
exports.isLowerCase = isLowerCase;
exports.isAlphaNumeric= isAlphaNumeric;