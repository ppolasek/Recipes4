"use strict";

// Copyright (c) 2017, Philip Polasek. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

var mydb = require('./db_module_obs');
var logger = require('../logger');
var Rx = require('rxjs/Rx');

/**
 * recipe_mongo_module.js
 *
 * Handles all Recipe-related operations against the MongoDb.
 */

var collection_recipe = 'recipe';
var collection_recipe_tag = 'recipe_tag';
var collection_cookbook = 'cookbook';
var collection_counters = 'counters';

exports.recipeSearch = function (body) {
    if (body != null) {
        var orList = [];

        // search on 'searchText': String
        if ('searchText' in body && body.searchText != null) {
            var txtRegEx = new RegExp(body.searchText, "i");
            logger.debug('recipe_mongo_module.recipeSearch() txtRegEx = ' + txtRegEx.toString());

            orList.push({ 'recipeName': txtRegEx });
            orList.push({ 'notes': txtRegEx});
        }

        // search on 'tags': List<RecipeTag>
        // example: 'recipeTags.id': { $in: [18] }
        if ('tags' in body && Array.isArray(body.tags) && body.tags.length > 0) {
            var idList = [];
            for (var i = 0; i < body.tags.length; i++) {
                idList.push(body.tags[i]['id']);
            }
            logger.debug('recipe_mongo_module.recipeSearch() idList = ' + idList.toString());

            orList.push({ 'recipeTags.id': { '$in': idList } });
        }

        var query = { '$or': orList };

        return mydb.findWithQuerySortCount(collection_recipe, query, {}, 100);
    } else {
        return Rx.Observable.of([]);
    }
};

/**
 * Get a recipe by id, and update the history that it has been viewed.
 * @param id The 'id' of the document to retrieve from the collection
 */
exports.getRecipeWithHistory = function (id) {
    logger.debug('recipe_mongo_module.getRecipeWithHistory() id = ' + id); // view_count_<id>
    return mydb.findByIdWithHistory(collection_recipe, id);
};

/**
 * Find the most-viewed recipes, returning 'count' records.
 * @param count The number of records to retrieve
 */
exports.findMostViewed = function (count) {
    logger.debug('recipe_mongo_module.findMostViewed() count = ' + count); // view_count_<id>
    return mydb.findMostViewed(collection_counters, collection_recipe, count);
};

/**
 * Find the most-recently added recipes, returning 'count' records.
 * @param count The number of records to retrieve
 */
exports.findAddedRecently = function (count) {
    logger.debug('recipe_mongo_module.findAddedRecently() count = ' + count);
    return mydb.findAddedRecently(collection_recipe, count);
};

/**
 * Delete one recipe by its 'id'.
 * @param id The Id of the recipe to delete if found
 */
exports.deleteRecipe = function (id) {
    logger.debug('recipe_mongo_module.deleteRecipe()');
    return mydb.deleteById(collection_recipe, id);
};

/**
 * Retrieve one recipe by its 'id'.
 * @param id The Id of the recipe to retrieve if found, this will return null
 *        if not found.
 */
exports.getRecipe = function (id) {
    logger.debug('recipe_mongo_module.getRecipe()');
    return mydb.findById(collection_recipe, id);
};

/**
 * Saves a new recipe to the database.
 * @param recipe The Recipe object to insert
 */
exports.saveRecipe = function (recipe) {
    logger.debug('recipe_mongo_module.saveRecipe() recipe:');
    logger.debug(recipe);

    // save any new cookbook
    return _saveCookbook(recipe.cookbook)
        .do(function (updatedCookbook) {
            logger.debug('recipe_mongo_module.saveRecipe() updatedCookbook:');
            logger.debug(updatedCookbook);
            recipe.cookbook = updatedCookbook;
        })
        .flatMap(function () {
            logger.debug('recipe_mongo_module.saveRecipe() saving recipe tags');
            return _saveRecipeTags(recipe.recipeTags);
        })
        .flatMap(function (newTags) {
            logger.debug('recipe_mongo_module.saveRecipe() after updating tags:');
            logger.debug(newTags);
            recipe.recipeTags = newTags;

            logger.debug('recipe_mongo_module.saveRecipe() saving recipe');
            return _saveRecipe(recipe);
        })
};

/**
 * Retrieve the entire collection of recipe tag documents.
 */
exports.getAllRecipeTags = function () {
    logger.debug('recipe_mongo_module.getAllRecipeTags()');
    return mydb.findAll(collection_recipe_tag);
};

/**
 * Saves a new recipe tag document to the collection.
 * @param recipeTag The RecipeTag object to insert
 */
exports.saveRecipeTag = function (recipeTag) {
    return _saveRecipeTag(recipeTag);
};

/**
 * Checks whether the cookbook needs to be saved to the collection.
 * @param cookbook The cookbook to be checked whether it
 *        should be inserted; if not, this function does nothing
 */
var _saveCookbook = function (cookbook) {
    logger.debug('recipe_mongo_module._saveCookbook()');
    if (cookbook != null &&
        (!('id' in cookbook) || cookbook.id === null || cookbook.id < 0) ) {

        logger.debug('recipe_mongo_module._saveCookbook() inserting a cookbook');
        return mydb.insertOne(collection_cookbook, cookbook);
    } else {
        logger.debug('recipe_mongo_module._saveCookbook() nothing to save; returning cookbook as-is');
        return Rx.Observable.of(cookbook);
    }
};

/**
 * Saves a new recipe tag document to the collection.
 * @param recipeTags The list of recipe tags, only the tags with id < 0 will be processed
 */
var _saveRecipeTags = function (recipeTags) {
    logger.debug('recipe_mongo_module._saveRecipeTags() processing recipe tags');
    
    // since the recipe tags are kept with the recipe now, new tags must be inserted first
    if (recipeTags == null ||
        !Array.isArray(recipeTags) || recipeTags.length <= 0) {
        logger.debug('recipe_mongo_module._saveRecipeTags() no recipe tags - returning empty list');
        return new Rx.Observable.of([]);
    }

    logger.debug('recipe_mongo_module._saveRecipeTags() recipeTags =');
    logger.debug(recipeTags);

    var itemCnt = recipeTags.length;
    logger.debug('recipe_mongo_module._saveRecipeTags() recipe tags to process = ' + itemCnt);

    return Rx.Observable.from(recipeTags)
        .flatMap(function (recipeTag) {
            logger.debug('recipe_mongo_module._saveRecipeTags() flatMap');
            if (!('id' in recipeTag) ||
                recipeTag.id == null ||
                recipeTag.id < 0) {
                logger.debug('recipe_mongo_module._saveRecipeTags() inserting tag:');
                logger.debug(recipeTag);
                
                return _saveRecipeTag(recipeTag);
            } else {
                logger.debug('recipe_mongo_module._saveRecipeTags() keeping tag as is: ' + recipeTag.tagName);
                return new Rx.Observable.of(recipeTag);
            }
        })
        .reduce(function (returnList, data) {
          logger.debug('recipe_mongo_module._saveRecipeTags() data = ' + data.toString());
          // logger.debug('recipe_mongo_module._saveRecipeTags() typeof data = ' + (typeof data));
          returnList.push(data);
          // logger.debug('recipe_mongo_module._saveRecipeTags() returnList = ' + returnList);
          logger.debug('recipe_mongo_module._saveRecipeTags() returnList instanceof Array = ' + (returnList instanceof Array).toString());
          return returnList;
        }, []);
};

/**
 * Saves a new recipe tag document to the collection.
 * @param recipeTag The RecipeTag object to insert
 */
var _saveRecipeTag = function (recipeTag) {
    logger.debug('recipe_mongo_module._saveRecipeTag() recipeTag:');
    logger.debug(recipeTag);
    return mydb.insertOne(collection_recipe_tag, recipeTag);
};

/**
 * Insert or Update the recipe.
 * @param recipe The recipe to be created or updated
 */
var _saveRecipe = function (recipe) {

    if (!('id' in recipe) || recipe.id == null || recipe.id < 0) {
        logger.debug('recipe_mongo_module._saveRecipe() inserting a new recipe');

        return mydb.insertOne(collection_recipe, recipe);
    } else {
        logger.debug('recipe_mongo_module._saveRecipe() updating the existing recipe');

        // define the query
        var query = { "id": recipe.id };

        return mydb.updateOne(collection_recipe, query, recipe);
    }
};
