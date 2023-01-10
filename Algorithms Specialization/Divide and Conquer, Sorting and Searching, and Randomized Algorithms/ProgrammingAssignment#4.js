let fs = require("fs");

function getRandomKey(collection) {
  let index = Math.floor(Math.random() * collection.size);
  let cntr = 0;
  for (let key of collection.keys()) {
    if (cntr++ === index) {
      return key;
    }
  }
}

function getEdgedVertex(arrayOfVertices) {
  let index = Math.floor(Math.random() * arrayOfVertices.length);
  return arrayOfVertices[index];
}

function contractEdges(v1, e1, v2, e2) {
  let contractedEdges = [];
  for (let i = 0; i < e1.length; i++) {
    if (e1[i] != v2) {
      contractedEdges.push(e1[i]);
    }
  }
  for (let j = 0; j < e2.length; j++) {
    if (e2[j] != v1 && contractedEdges.indexOf(e2[j]) === -1) {
      contractedEdges.push(e2[j]);
    }
  }

  return contractedEdges;
}

function getCutsSize(contractedMap, OriginalMap) {
  let firstKeys = contractedMap.keys().next().value.split("-");
  let firstValues = contractedMap.values().next().value[0].split("-");

  // console.log(firstKeys, firstValues);

  let cutsSize = 0;
  for (let i = 0; i < firstKeys.length; i++) {
    const edgesBeforeContraction = OriginalMap.get(firstKeys[i]);
    for (let j = 0; j < edgesBeforeContraction.length; j++) {
      const element = edgesBeforeContraction[j];
      if (firstValues.indexOf(element) !== -1) {
        cutsSize++;
      }
    }
  }

  return cutsSize;
}

function contract(map) {
  let randomKey = getRandomKey(map);
  let edgedVertices = map.get(randomKey);
  let edgedVertex = getEdgedVertex(edgedVertices);

  let newVertex = randomKey + "-" + edgedVertex;
  let newEdges = contractEdges(
    randomKey,
    edgedVertices,
    edgedVertex,
    map.get(edgedVertex)
  );

  map.forEach(function (value, key) {
    if (key == randomKey || key == edgedVertex) {
      map.delete(key);
    } else {
      let reformatEdges = [];
      const currentEdges = value;
      isEdgedToContractedVertex = false;
      for (let i = 0; i < currentEdges.length; i++) {
        if (currentEdges[i] != randomKey && currentEdges[i] != edgedVertex) {
          reformatEdges.push(currentEdges[i]);
        } else {
          isEdgedToContractedVertex = true;
        }
      }
      if (isEdgedToContractedVertex) {
        reformatEdges.push(newVertex);
      }

      map.set(key, reformatEdges);
    }
  });
  map.set(newVertex, newEdges);
  return map;
}

function minCut(map) {
  let numberOfVerticies = map.size;
  let minimumCut = (numberOfVerticies * (numberOfVerticies - 1)) / 2; // Maximum MinCut In A Graph

  for (let i = 0; i <= numberOfVerticies * (numberOfVerticies - 1); i++) {
    let copyMap = new Map(map);
    while (copyMap.size > 2) {
      copyMap = contract(copyMap);
    }
    const cutsSize = getCutsSize(copyMap, map);

    if (cutsSize < minimumCut) minimumCut = cutsSize;
  }

  return minimumCut;
}

// Test Cases
const verticesT1 = new Map([
  ["1", ["2", "3", "4"]],
  ["2", ["1", "3", "4", "5"]],
  ["3", ["1", "2", "4"]],
  ["4", ["1", "2", "3", "5"]],
  ["5", ["2", "4"]],
]);
console.log("Testing using", verticesT1);
console.log("Expecting:", 2);
console.log("Returned:", minCut(verticesT1));

console.log("Testing using kargerMinCut.txt");
console.log("Expecting:", 17);
fs.readFile("kargerMinCut.txt", function (err, data) {
  if (err) throw err;
  let array = data.toString().split("\n").slice(0, -1);

  const vertices = new Map();
  for (i in array) {
    const formatArray = array[i].split("\t");
    let key = formatArray[0];
    let value = formatArray.slice(1, -1);

    vertices.set(key, value);
  }
  console.log("Returned:", minCut(vertices));
});
