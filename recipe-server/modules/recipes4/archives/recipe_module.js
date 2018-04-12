"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var logger = require('../../logger');

/**
 * recipe_module.js
 *
 * Manages all incoming requests for Recipe-related data.
 */


// TODO implement these
// Recipe Services
//  Future<List<Recipe>> recipeSearch(SearchCriteria criteria);

/**
 * Search for recipes.
 * @param body The criteria for searching for recipes
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.recipeSearch = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.recipeSearch() body:');
        logger.debug(body);

        recipe_mongo_module.recipeSearch(body, responseHandler);
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Get a recipe by id, and update the history that it has been viewed.
 * @param body The array containing the number of recipes to return
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.getRecipeWithHistory = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.getRecipeWithHistory() body[0] = ' + body[0]);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(body[0]) && body[0] > 0) {
            recipe_mongo_module.getRecipeWithHistory(body[0], responseHandler);
        } else {
            responseHandler(new Error('Not a number: ' + body[0]), null);
        }
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Find the most-viewed added recipes, returning 'count' records.
 * @param body The array containing the number of recipes to return
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findMostViewed = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.findMostViewed() body[0] = ' + body[0]);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(body[0]) && body[0] > 0) {
            recipe_mongo_module.findMostViewed(body[0], responseHandler);
        } else {
            responseHandler(new Error('Not a number: ' + body[0]), null);
        }
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Find the most-recently added recipes, returning 'count' records.
 * @param body The array containing the number of recipes to return
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.findAddedRecently = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.findAddedRecently() body[0] = ' + body[0]);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(body[0]) && body[0] > 0) {
            recipe_mongo_module.findAddedRecently(body[0], responseHandler);
        } else {
            responseHandler(new Error('Not a number: ' + body[0]), null);
        }
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Delete a recipe.
 * @param body The array containing the id of the recipe to delete
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.deleteRecipe = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.deleteRecipe() body[0] = ' + body[0]);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(body[0]) && body[0] > 0) {
            recipe_mongo_module.deleteRecipe(body[0], responseHandler);
        } else {
            responseHandler(new Error('Not a number: ' + body[0]), null);
        }
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Get a recipe by id.
 * @param body The array containing the id of the recipe to retrieve
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.getRecipe = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.getRecipe() body[0] = ' + body[0]);

        // type check that 'body' is a primitive number and not something more sinister.
        if (Number.isInteger(body[0]) && body[0] > 0) {
            recipe_mongo_module.getRecipe(body[0], responseHandler);
        } else {
            responseHandler(new Error('Not a number: ' + body[0]), null);
        }
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Save a recipe.
 * @param A Recipe object to insert
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.saveRecipe = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.saveRecipe() body:');
        logger.debug(body);

        recipe_mongo_module.saveRecipe(body, responseHandler);
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * create a new recipe.
 * @param A Recipe object to insert
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.createRecipe = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.createRecipe() body:');
        logger.debug(body);

        recipe_mongo_module.saveRecipe(body, responseHandler);
    } catch (err) {
        responseHandler(err);
    }
}

/**
 * Get all recipe tags from the database
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.getAllRecipeTags = function (body, responseHandler) {
    logger.debug('recipe_module.getAllRecipeTags()');
    recipe_mongo_module.getAllRecipeTags(responseHandler);
}

/**
 * Save a recipe tag object.
 * @param A RecipeTag object to insert
 * @param responseHandler The function to call when an error occurs or the call
 *        completes with the updated object
 */
exports.saveRecipeTag = function (body, responseHandler) {
    try {
        logger.debug('recipe_module.saveRecipeTag() body:');
        logger.debug(body);

        recipe_mongo_module.saveRecipeTag(body, responseHandler);
    } catch (err) {
        responseHandler(err);
    }
}
