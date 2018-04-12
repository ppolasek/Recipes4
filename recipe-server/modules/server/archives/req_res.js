"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var http = require('http');
var url = require('url');
// var cookbook_module = require('./cookbook_module');
// var recipe_module = require('./recipe_module');
var log_module = require('./log_module');
var logger = require('../../logger');
var send_response = require('../send_response');
var req_res_converter = require('../req_res_converter');

/**
 * req_res.js
 *
 * Analyze and route the incoming requests and sending a response back to the
 * caller.
 */

/**
 * Request/Response handler
 */
exports.handleRequestResponse = function (req, res) {
    try {
        logger.debug('------------------------------------------------------------------------------------------');
        logger.debug('req_res.handleRequestResponse()');
        logger.debug('req_res.handleRequestResponse() req.method = %s, req.url = %s', req.method, req.url);

        res.on('error', function (err) {
          logger.error(err);
        });

        if ('OPTIONS' == req.method) {
            send_response.options(res);
        } else if ('POST' == req.method || 'GET' == req.method) {
            logger.debug('req_res.handleRequestResponse() handling get/post request');

            // the context path is /Recipes4
            // the servlet path is /services
            var myURL = url.parse(req.url);
            logger.debug('req_res.handleRequestResponse() myURL.pathname: %s', myURL.pathname);

            if (myURL.pathname.length > 0 && myURL.pathname.indexOf('/Recipes4/services') == 0) {
                var myURL = url.parse(req.url);

                var elements = myURL.pathname.split('/');

                if (elements.length == 4) {
                    var methodName = elements[3];
                    logger.debug('req_res.handleRequestResponse() methodName = ' + methodName);

                    _processRequest(req, res, methodName);
                } else {
                    // return error
                    send_response.bad_request(res, myURL.pathname);
                }
            } else {
                // return error
                send_response.bad_request(res, myURL.pathname);
            }
        } else {
            // return error
            send_response.method_not_allowed(res, req.method);
        }
    } catch (err) {
        send_response.error(res, err);
    }
}

/**
 * Process a request for the specified method name
 * @param req The HTTP Request
 * @param res The HTTP Response
 * @param methodName The method to request from the URL
 */
function _processRequest(req, res, methodName) {
    try {

        // Get the content/body of the request.
        var body = [];
        req.on('error', function (err) {
            logger.error('req_res._processRequest() error caught');
            console.error(err);
        }).on('data', function (chunk) {
            logger.debug('req_res._processRequest() pushing chunk');
            body.push(chunk);
        }).on('end', function () {
            logger.debug('req_res._processRequest() end of chunked data');
            body = Buffer.concat(body).toString();

            // at this point, `body` has the entire request body stored in it as a string
            logger.debug('body = ' + body);

            logger.debug('req_res._processRequest() body.length = ' + body.length);
            var bodyJs = req_res_converter.convert_from_json(body);

//            console.log('req_res._processRequest() body.length = ' + body.length);
//            console.log('req_res._processRequest() recipe_module[methodName] : ' + (recipe_module[methodName]));
//            console.log('req_res._processRequest() recipe_module[methodName] is undefined 1: ' + (recipe_module[methodName] == 'undefined'));
//            console.log('req_res._processRequest() recipe_module[methodName] is undefined 2: ' + (recipe_module[methodName] == undefined));
//            console.log('req_res._processRequest() recipe_module[methodName] is undefined 3: ' + (recipe_module[methodName] === 'undefined'));
//            console.log('req_res._processRequest() recipe_module[methodName] is undefined 4: ' + (recipe_module[methodName] === undefined));
//            console.log('req_res._processRequest() cookbook_module[methodName] : ' + (cookbook_module[methodName]));
//            console.log('req_res._processRequest() cookbook_module[methodName] !== \'undefined\': ' + (cookbook_module[methodName] == 'undefined'));
//
//            logger.debug('req_res._processRequest() body.length = ' + body.length);
//            logger.debug('req_res._processRequest() recipe_module[methodName] !== \'undefined\': ' + (recipe_module[methodName] !== 'undefined'));
//            logger.debug('req_res._processRequest() cookbook_module[methodName] !== \'undefined\': ' + (cookbook_module[methodName] !== 'undefined'));

            // Find the module which can process the request.
            if (methodName in recipe_module) {
                recipe_module[methodName](bodyJs, function (err, output) {
                    if (err) {
                        logger.error(err);
                        send_response.error(res, err);
                    } else {
                        logger.debug('req_res._processRequest() output:');
                        logger.debug(output);
                        send_response.ok(res, output);
                    }
                });
            } else if (methodName in cookbook_module) {
                cookbook_module[methodName](bodyJs, function (err, output) {
                    if (err) {
                        logger.error(err);
                        send_response.error(res, err);
                    } else {
                        send_response.ok(res, output);
                    }
                });
            } else if (methodName in log_module) {
                log_module[methodName](bodyJs, function (err, output) {
                    if (err) {
                        logger.error(err);
                        send_response.error(res, err);
                    } else {
                        send_response.ok(res, output);
                    }
                });
            } else {
                // return error
                send_response.bad_request(res, methodName);
            }
        });
    } catch (err) {
        send_response.error(res, err);
    }
}
