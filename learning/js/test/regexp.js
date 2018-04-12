

var str = 'MongoError: E11000 duplicate key error index: recipes4.recipe_tag.$tagName_1 dup key: { : "Sandwich" }';
var str1 = 'duplicate error';

//var regex = new RegExp('^MongoError:\\s(\\w+)\\s.*$', 'g');
//var regex = new RegExp('(?=\\S+\\s+){1}(\\S+)', 'g');
var regex = new RegExp('^MongoError:\\s(\\w+)\\s(.*)', 'g');

var code = str.replace(regex, '$1');
var code1 = str1.replace(regex, '$1');

console.log('str = ' + str);
console.log('regex = ' + regex);
console.log('code = ' + code);
console.log('code1 = ' + code1);
