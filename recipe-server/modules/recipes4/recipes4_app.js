"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var logger = require('../logger');
var recipe_mongo_module = require('../mongo/recipe_mongo_module.js');
var cookbook_mongo_module = require('../mongo/cookbook_mongo_module.js');
var log_mongo_module = require('../mongo/log_mongo_module.js');
var Rx = require('rxjs/Rx');

var express = require('express');
var router = express.Router();

module.exports = router;

/**
 * recipes4_app.js
 *
 * Default entry point to the server, this will perform the MongoDb setup
 * operations, start the db service request server, and then start the web server.
 */

/**
 * Store the log record.
 */
router.post('/logger', function (req, res, next) {
    try {
        log_mongo_module.log(req.body).subscribe(
            function (_) { next(); },
            function (err) {
                req.recipes4.err = err;
                next();
            }
        );
        // var cookbookObs = Rx.Observable.bindNodeCallback(log_mongo_module.log);
        //
        // cookbookObs(req.body).subscribe(
        //     function (_) { next(); },
        //     function (err) {
        //         req.recipes4.err = err;
        //         next();
        //     }
        // );
        
        // log_mongo_module.log(req.body, function (err, output) {
        //     if (err) {
        //         req.recipes4.err = err;
        //     }
        //     next();
        // });
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/getCookbookById', function (req, res, next) {
    try {
        logger.debug('recipes4_app.getCookbookById() body[0] = ' + req.body[0]);
        // logger.debug('recipes4_app.getCookbookById()');
        // logger.debug('recipes4_app.getCookbookById() req.body:');
        // logger.debug(req.body);
        // logger.debug('recipes4_app.getCookbookById() req.recipes4: ' + req.recipes4);
        // logger.debug(req.recipes4);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(req.body[0]) && req.body[0] > 0) {
            cookbook_mongo_module.getCookbookById(req.body[0]).subscribe(
                // TODO this logic is all the same in each method, so refactor
                function (x) {
                    req.recipes4.output = x;
                    next();
                },
                function (e) {
                    req.recipes4.err = e;
                    next();
                }
            );
        } else {
            responseHandler(new Error('Not a number: ' + req.body[0]), null);
            next();
        }
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/getAllCookbooks', function (req, res, next) {
    try {
        cookbook_mongo_module.getAllCookbooks().subscribe(
            function (x) {
                req.recipes4.output = x;
                next();
            },
            function (e) {
                req.recipes4.err = e;
                next();
            }
        );
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/recipeSearch', function (req, res, next) {
    try {
        recipe_mongo_module.recipeSearch(req.body).subscribe(
        // TODO this logic is all the same in each method, so refactor
        function (x) {
            req.recipes4.output = x;
            next();
        },
        function (e) {
            req.recipes4.err = e;
            next();
        }
    );
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/getRecipeWithHistory', function (req, res, next) {
    try {
        logger.debug('recipes4_app.getRecipeWithHistory() body[0] = ' + req.body[0]);
    
        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(req.body[0]) && req.body[0] > 0) {
            recipe_mongo_module.getRecipeWithHistory(req.body[0]).subscribe(
                // TODO this logic is all the same in each method, so refactor
                function (x) {
                    req.recipes4.output = x;
                    next();
                },
                function (e) {
                    req.recipes4.err = e;
                    next();
                }
            );
        } else {
            req.recipes4.err = new Error('Not a number: ' + req.body[0]);
            next();
        }
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/findMostViewed', function (req, res, next) {
    try {
        logger.debug('recipes4_app.findMostViewed() req.body[0] = ' + req.body[0]);
    
        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(req.body[0]) && req.body[0] > 0) {
            recipe_mongo_module.findMostViewed(req.body[0]).subscribe(
                // TODO this logic is all the same in each method, so refactor
                function (x) {
                    req.recipes4.output = x;
                    next();
                },
                function (e) {
                    req.recipes4.err = e;
                    next();
                }
            );
        } else {
            req.recipes4.err = new Error('Not a number: ' + req.body[0]);
            next();
        }
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/findAddedRecently', function (req, res, next) {
    try {
        logger.debug('recipes4_app.findAddedRecently() req.body[0] = ' + req.body[0]);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(req.body[0]) && req.body[0] > 0) {
            recipe_mongo_module.findAddedRecently(req.body[0]).subscribe(
                // TODO this logic is all the same in each method, so refactor
                function (x) {
                    req.recipes4.output = x;
                    next();
                },
                function (e) {
                    req.recipes4.err = e;
                    next();
                }
            );
        } else {
            req.recipes4.err = new Error('Not a number: ' + req.body[0]);
            next();
        }
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/deleteRecipe', function (req, res, next) {
    try {
        logger.debug('recipes4_app.deleteRecipe() req.body[0] = ' + req.body[0]);
    
        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(req.body[0]) && req.body[0] > 0) {
            recipe_mongo_module.deleteRecipe(req.body[0]).subscribe(
                // TODO this logic is all the same in each method, so refactor
                function (x) {
                    req.recipes4.output = x;
                    next();
                },
                function (e) {
                    req.recipes4.err = e;
                    next();
                }
            );
        } else {
            responseHandler(new Error('Not a number: ' + req.body[0]), null);
            next();
        }
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/getRecipe', function (req, res, next) {
    try {
        logger.debug('recipes4_app.getRecipe() req.body[0] = ' + req.body[0]);
    
        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(req.body[0]) && req.body[0] > 0) {
            recipe_mongo_module.getRecipe(req.body[0]).subscribe(
                // TODO this logic is all the same in each method, so refactor
                function (x) {
                    req.recipes4.output = x;
                    next();
                },
                function (e) {
                    req.recipes4.err = e;
                    next();
                }
            );
        } else {
            responseHandler(new Error('Not a number: ' + req.body[0]), null);
            next();
        }
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/saveRecipe', function (req, res, next) {
    try {
        recipe_mongo_module.saveRecipe(req.body).subscribe(
            // TODO this logic is all the same in each method, so refactor
            function (x) {
                req.recipes4.output = x;
                next();
            },
            function (e) {
                req.recipes4.err = e;
                next();
            }
        );
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/createRecipe', function (req, res, next) {
    try {
        recipe_mongo_module.saveRecipe(req.body).subscribe(
            // TODO this logic is all the same in each method, so refactor
            function (x) {
                req.recipes4.output = x;
                next();
            },
            function (e) {
                req.recipes4.err = e;
                next();
            }
        );
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/getAllRecipeTags', function (req, res, next) {
    try {
        recipe_mongo_module.getAllRecipeTags().subscribe(
            // TODO this logic is all the same in each method, so refactor
            function (x) {
                req.recipes4.output = x;
                next();
            },
            function (e) {
                next();
            }
        );
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});

router.post('/saveRecipeTag', function (req, res, next) {
    try {
        recipe_mongo_module.saveRecipeTag(req.body).subscribe(
            // TODO this logic is all the same in each method, so refactor
            function (x) {
                req.recipes4.output = x;
                next();
            },
            function (e) {
                req.recipes4.err = e;
                next();
            }
        );
    } catch (err) {
        req.recipes4.err = err;
        next();
    }
});
