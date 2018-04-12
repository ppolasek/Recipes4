"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var recipe_util = require('../recipe_util');
// var logger = require('../logger');

/**
 * req_res_converter.js
 *
 * Convert the incoming requests and outgoing responses so they can be managed
 * internally and by the invoker.
 */


/**
 * Add the recipes4 object to the request so downstream apps may use it
 * @param req
 * @param res
 * @param next
 */
exports.add_recipes4_obj = function (req, res, next) {
    // logger.debug('req_res_converter.add_recipes4_obj()');
    req.recipes4 = {};
    next();
}

/**
 * Convert the int properties in the request for known date attributes to a
 * date to be use downstream as a date.
 * @param req
 * @param res
 * @param next
 */
exports.request_property_converter = function (req, res, next) {
    // logger.debug('req_res_converter.request_property_converter() req.body: ' + ('body' in req && req.body !== null ? 'exists and is not null' : 'is null') );
    if ('body' in req && req.body !== null) {
        convert_request_properties(req.body);
    }
    next();
}

/**
 * Convert the datetime properties in the response to an int as json doesn't
 * like date values.
 * @param req
 * @param res
 * @param next
 */
exports.response_property_converter = function (req, res, next) {
    // logger.debug('req_res_converter.request_property_converter() req.recipes4: ' + ('recipes4' in req && req.recipes4 !== null ? 'exists and is not null' : 'is null') );
    if ('recipes4' in req && req.recipes4 != null) {
        convert_response_properties(req.recipes4);
    }
    next();
}

/**
 * Converts the JavaScript object to a JSON string.
 * @param output The JavaScript object
 * @return The JSON string from the JavaScript object
 */
exports.convert_to_json = function (output) {
    return (output !== 'undefined' && output != null) ? JSON.stringify(output) : null;
}

/**
 * Convert properties on the JavaScript object before sending it to the
 * database.
 */
var convert_request_properties = function (obj) {
    // logger.debug('req_res_converter.convert_request_properties() obj:');
    // logger.debug(obj);
    // console.log(obj);
//    logger.debug('req_res_converter.convert_request_properties() \'createdOn\' in obj = ' + (obj != null ? ('createdOn' in obj) : 'null'));

    if (obj != null && typeof obj === 'object') {
        // convert known date properties to Date objects instead of integers
        if ('createdOn' in obj && Number.isInteger(obj.createdOn)) {
            obj.createdOn = recipe_util.convertNumberToDate(obj.createdOn);
        }

        if ('updatedOn' in obj && Number.isInteger(obj.updatedOn)) {
            obj.updatedOn = recipe_util.convertNumberToDate(obj.updatedOn);
        }

        for (var prop in obj) {
//            logger.debug('req_res_converter.convert_request_properties() prop = ' + prop);
//            logger.debug('req_res_converter.convert_request_properties() typeof prop = ' + (typeof prop));
//            logger.debug('req_res_converter.convert_request_properties() Array.isArray(prop) = ' + Array.isArray(prop));
//
//            logger.debug('req_res_converter.convert_request_properties() obj[prop] = ' + obj[prop]);
//            logger.debug('req_res_converter.convert_request_properties() typeof obj[prop] = ' + (typeof obj[prop]));
//             logger.debug('req_res_converter.convert_request_properties() Array.isArray(obj[' + prop + ']) = ' + Array.isArray(obj[prop]));

            if (obj.hasOwnProperty(prop) && Array.isArray(obj[prop])) {
                // logger.debug('req_res_converter.convert_request_properties() this is an array element');
                for (var i = 0; i < obj[prop].length; i++) {
                    convert_request_properties(obj[prop][i]);
                }
            }
        }
    }
}

/**
 * Convert properties on the JavaScript object before converting it back to a
 * JSON object.
 */
var convert_response_properties = function (obj) {
   // logger.debug('req_res_converter.convert_response_properties() obj:');
   // logger.debug(obj);
//    logger.debug('req_res_converter.convert_response_properties() \'createdOn\' in obj = ' + (obj != null && typeof obj === 'object' ? 'createdOn' in obj : 'null'));

    if (obj != null && typeof obj === 'object') {
        if ('createdOn' in obj && Object.prototype.toString.call(obj.createdOn) === '[object Date]') {
            obj.createdOn = recipe_util.convertDateToNumber(obj.createdOn);
        }

        if ('updatedOn' in obj && Object.prototype.toString.call(obj.updatedOn) === '[object Date]') {
            obj.updatedOn = recipe_util.convertDateToNumber(obj.updatedOn);
        }

        for (var prop in obj) {
//            logger.debug('req_res_converter.convert_response_properties() prop = ' + prop);
//            logger.debug('req_res_converter.convert_response_properties() typeof prop = ' + (typeof prop));
//            logger.debug('req_res_converter.convert_response_properties() Array.isArray(prop) = ' + Array.isArray(prop));
//
//            logger.debug('req_res_converter.convert_response_properties() obj[prop] = ' + obj[prop]);
//            logger.debug('req_res_converter.convert_response_properties() typeof obj[prop] = ' + (typeof obj[prop]));
//             logger.debug('req_res_converter.convert_response_properties() Array.isArray(obj[' + prop + ']) = ' + Array.isArray(obj[prop]));

            if (obj.hasOwnProperty(prop) && Array.isArray(obj[prop])) {
                // logger.debug('req_res_converter.convert_response_properties() this is an array element');
                for (var i = 0; i < obj[prop].length; i++) {
                    convert_response_properties(obj[prop][i]);
                }
            }
        }
    }
}
