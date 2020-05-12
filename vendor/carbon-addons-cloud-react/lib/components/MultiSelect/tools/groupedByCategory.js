"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function AlphabeticSort(a, b) {
  return a[0].localeCompare(b[0]);
}

var groupedByCategory = exports.groupedByCategory = function groupedByCategory(items, customCategorySorting) {
  var result = items.reduce(function (groupedArray, currentItem) {
    groupedArray[currentItem.category] = groupedArray[currentItem.category] || [];
    groupedArray[currentItem.category].push(currentItem);
    return groupedArray;
  }, Object.create(null));

  var finalResult = Object.keys(result).reduce(function (array, key) {
    var elementArr = [key, result[key]];
    array.push(elementArr);
    return array;
  }, []);
  var comparator = customCategorySorting ? customCategorySorting : AlphabeticSort;
  finalResult.sort(comparator);

  return finalResult;
};