var fs = require("fs");

function mergeAndCount(left, right) {
  let mergedArray = [];
  let splitInversions = 0;

  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      mergedArray.push(left[leftIndex]); // O(1) * O(len int)
      leftIndex++;
    } else {
      mergedArray.push(right[rightIndex]);
      rightIndex++;
      splitInversions = splitInversions + (left.length - leftIndex);
    }
  }

  while (leftIndex < left.length) {
    mergedArray.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    mergedArray.push(right[rightIndex]);
    rightIndex++;
  }

  return {
    mergedArray,
    splitInversions,
  };
}

function sortAndCount(array) {
  let length = array.length;
  if (length <= 1) return { sortedArray: array, inversions: 0 };

  let leftHalf = array.slice(0, length / 2);
  let rightHalf = array.slice(length / 2, length);

  let sortLeftHalf = sortAndCount(leftHalf);
  let sortedLeftHalf = sortLeftHalf.sortedArray;
  let leftInversions = sortLeftHalf.inversions;

  let sortRightHalf = sortAndCount(rightHalf);
  let sortedRightHalf = sortRightHalf.sortedArray;
  let rightInversions = sortRightHalf.inversions;

  let mergeArray = mergeAndCount(sortedLeftHalf, sortedRightHalf);
  let sortedArray = mergeArray.mergedArray;
  let splitInversions = mergeArray.splitInversions;

  return {
    sortedArray,
    inversions: splitInversions + leftInversions + rightInversions,
  };
}

// Test Cases
t1 = [1, 3, 5, 2, 4, 6];
console.log("Testing using", t1);
console.log("Expecting:", 3);
console.log("Returned:", sortAndCount(t1).inversions);

t2 = [1, 5, 3, 2, 4];
console.log("\nTesting using", t2);
console.log("Expecting:", 4);
console.log("Returned:", sortAndCount(t2).inversions);

t3 = [5, 4, 3, 2, 1];
console.log("\nTesting using", t3);
console.log("Expecting:", 10);
console.log("Returned:", sortAndCount(t3).inversions);

t4 = [1, 6, 3, 2, 4, 5];
console.log("\nTesting using", t4);
console.log("Expecting:", 5);
console.log("Returned:", sortAndCount(t4).inversions);

t5 = [1, 2, 3, 4, 5, 6];
console.log("\nTesting using", t5);
console.log("Expecting:", 0);
console.log("Returned:", sortAndCount(t5).inversions);

console.log("\n\nFinal run against IntergerArray.txt");
fs.readFile("IntegerArray.txt", function (err, data) {
  if (err) throw err;
  let array = data.toString().split("\n");
  let t6 = [];
  for (i in array) {
    t6.push(Number(array[i]));
  }

  console.log("Returned:", sortAndCount(t6).inversions);
});
