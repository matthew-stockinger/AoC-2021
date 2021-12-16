let testInput1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const testInput2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const testInput3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

const mainInput = `ey-dv
AL-ms
ey-lx
zw-YT
hm-zw
start-YT
start-ms
dv-YT
hm-ms
end-ey
AL-ey
end-hm
rh-hm
dv-ms
AL-dv
ey-SP
hm-lx
dv-start
end-lx
zw-AL
hm-AL
lx-zw
ey-zw
zw-dv
YT-ms`;

/* construct graph structure
traverse it, building a list of paths (memoize or tabulate?)
 *while traversing, when a lowercase node is visited, remove it from the graph.
 for each neighboring node


return length of list.
*/

function constructGraph(input) {
  const testArr = input.split("\n");
  const _graph = new Map(); // 'node' => Set {'dest1', 'dest2', ...}
  testArr.forEach(edge => {
    let origin = edge.slice(0, edge.indexOf('-'));
    let dest = edge.slice(edge.indexOf('-') + 1);
    if (_graph.has(origin)) _graph.get(origin).add(dest);
    else _graph.set(origin, new Set([dest]));
    // do same in reverse; undirected graph.
    if (_graph.has(dest)) _graph.get(dest).add(origin);
    else _graph.set(dest, new Set([origin]));
  });
  return _graph;
}
function constructGraph2(input) {
  const inputArr = input.split("\n");
  const _graph = new Map(); // 'node' => ['dest1', 'dest2', ...]
  inputArr.forEach(edge => {
    let origin = edge.slice(0, edge.indexOf('-'));
    let dest = edge.slice(edge.indexOf('-') + 1);
    if (_graph.has(origin)) _graph.get(origin).push(dest);
    else _graph.set(origin, [dest]);
    // do same in reverse; undirected graph.
    if (_graph.has(dest)) _graph.get(dest).push(origin);
    else _graph.set(dest, [origin]);
  });
  return _graph;
}

/* My first attempt, not really knowing what I'm doing. 
// origin: string name of node.
// dest: string name of node.
// graph: Map output of constructGraph
function allPaths(origin, dest, graph) {
  if (origin == dest) return [[]];
  else {
    let _allPaths = [];
    // store neighbors from here
    let neighbors = graph.get(origin);
    
    // deep copy graph (Map, values are sets)
    let graphCopy = new Map();
    for (let [node, adjacents] of graph) {
      graphCopy.set(node, new Set(adjacents));
    }

    // if start or lowercase, find and remove all pointers to this location,
    // so that it isn't visited again.
    if (/[a-z]/.test(origin)) {
      for (let [node, adjacents] of graphCopy) {
        adjacents.delete(origin); // ensure origin isn't in any adjacency lists.
        if (adjacents.size == 0) { // if a node is now isolated
          graphCopy.delete(node); // delete it
          neighbors.delete(node); // and don't go down that road
        }
      }
      // and remove current location from graph before recursing.
      graphCopy.delete(origin);
    }
    
    for (let neighbor of neighbors) {
      const subGraph = allPaths(neighbor, dest, graphCopy);
      subGraph.forEach(path => _allPaths.push([neighbor, ...path]));
    }

    return _allPaths;
  }
}
*/

/******** Part 1 ********** */
function allPaths(origin, finish, graph) {
  const stack = [[origin]];
  const _allPaths = [];

  while (stack.length > 0) {
    let currentPath = stack.pop();
    let current = currentPath[currentPath.length - 1];

    // append to return value if found a path to finish.
    if (current == finish) _allPaths.push(currentPath);

    // don't go back to lowercase neighbors that have already been visited.
    let neighbors = new Set(graph.get(current)); // need new set, so that the set in graph isn't altered.
    for (let neighbor of neighbors) {
      if (currentPath.includes(neighbor) && /[a-z]/.test(neighbor)) {
        neighbors.delete(neighbor);
      }
    }

    // append neighbors to currentPath and add each new path to the stack.
    for (let neighbor of neighbors) {
      stack.push([...currentPath, neighbor]);
    }

  }
  return _allPaths;
}

/******* Part 2 ************ */
/* Old idea was: replace b with B* on the fly.  Caused all sorts of problems.
New idea: keep same graph.  Make a separate Map that stores visitsLeft.
if lowercase and visitsLeft == 0, then remove from neighbors.
*/

function allPaths2(origin, finish, graph) {
  let stack = [[origin]];
  const _allPaths = [];

  // add newfound paths to _allPaths.
  while (stack.length > 0) {
    let currentPath = stack.pop();
    let current = currentPath[currentPath.length - 1];
    let doubled = lowercaseDoubled(currentPath);

    // append to return value if found a new path to finish.
    // let newPath = !_allPaths.map(e => e.join()).includes(currentPath.join());
    let newPath = true;
    if (current == finish && newPath) {
      _allPaths.push(currentPath);
      // console.log(currentPath);
    }
    else {
      // Only go back to a lowercase neighbor if no other lowercase appears twice in the currentPath.
      // IOW, if neighbor is lowercase 
      // && already in currentPath
      // && any lowercase has already doubled
      // then remove it from neighbors.
      let neighbors = [...graph.get(current)]; // need new set, so that the set in graph isn't altered.
      for (let neighbor of [...neighbors]) {
        if (currentPath.includes(neighbor) && /[a-z]/.test(neighbor) && doubled) {
          neighbors.splice(neighbors.indexOf(neighbor), 1);
        } else if (neighbor == 'start') {
          neighbors.splice(neighbors.indexOf(neighbor), 1);
        }
      }

      // append neighbors to currentPath and add each new path to the stack.
      for (let neighbor of neighbors) {
        stack.push([...currentPath, neighbor]);
      }
    }
  }

  return _allPaths;
}

function lowercaseDoubled(path) {
  let doubled = false;
  path = path.filter(e => /[a-z]/.test(e));
  let pathString = path.join();
  for (const node of path) {
    if ([...pathString.matchAll(node)].length > 1) doubled = true;
  }

  // path.forEach((node, i, arr) => {
  //   let copy = [...arr];
  //   copy.splice(i, 1);
  //   if (copy.includes(node)) doubled = true;
    // let howMany = arr.filter(e => e == node).length;
    // if (howMany > 1) doubled = true;
  // });
  return doubled;
}

// debugger;

function constructVisits(graph) {
  const visits = new Map();
  for (const node of graph.keys()) {
    visits.set(node, 1);
  }
  return visits;
}

function graphCopy(graph) {
  // deep copy the graph
  const _graphCopy = new Map();
  for (const [sourceNode, adjacentList] of graph) {
    _graphCopy.set(sourceNode, [...adjacentList]);
  }
  return _graphCopy;
}

const graph1 = constructGraph2(testInput1);
// console.log(graph1);
const graph1Paths = allPaths2('start', 'end', graph1);
// console.log(graph1Paths);
console.log(graph1Paths.length);

const graph2 = constructGraph(testInput2);
const graph2Paths = allPaths2('start', 'end', graph2);
console.log(graph2Paths.length);

const graph3 = constructGraph(testInput3);
// console.log(graph3);
const graph3Paths = allPaths2('start', 'end', graph3);
console.log(graph3Paths.length);

const mainGraph = constructGraph(mainInput);
const mainGraphPaths = allPaths2('start', 'end', mainGraph);
console.log(mainGraphPaths.length);




/*********** code dungeon - old, crappy ideas. *********** */
/* 

// graph must be of form Map: 'nodeString' => [adjacencyList]
function allPaths2(origin, finish, graph) {
  let stack = [[origin]];
  const _allPaths = [];

  // loop through all nodes.  If node is lowercase and not start/end, then
  // make it uppercase with * in all adjacencyLists in which it appears.  
  // Then run while below.
  for (const [sourceNode, _] of graph) {
    const graphClone = graphCopy(graph);
    if (/[a-z]/.test(sourceNode) && !['start', 'end'].includes(sourceNode)) {
      // change lowercase node name to uppercase*
      graphClone.set(sourceNode.toUpperCase() + "*", graphClone.get(sourceNode));
      graphClone.delete(sourceNode);

      // make same change in all adjacencyLists.
      for (const adjacents of graphClone.values()) {
        if (adjacents.includes(sourceNode)) {
          let i = adjacents.indexOf(sourceNode);
          adjacents.splice(i, 1, sourceNode.toUpperCase() + "*");
        }
      }
    }
    
    // add all possible paths through current graphClone to _allPaths.
    while (stack.length > 0) {
      let currentPath = stack.pop();
      let current = currentPath[currentPath.length - 1];
  
      // append to return value if found a *new* path to finish.
      let newPath = !_allPaths.map(e => e.join()).includes(currentPath.join());
      if (current == finish && newPath) _allPaths.push(currentPath);
      else {
        // don't go back to lowercase neighbors that have already been visited.
        // separate pass through neighbors: replace e.g. 'A*' with 'a'
        let neighbors = [...graphClone.get(current)]; // need new array, so that the array in graph isn't altered.
        for (let neighbor of [...neighbors]) {
          if (currentPath.includes(neighbor) && /[a-z]/.test(neighbor)) {
            neighbors.splice(neighbors.indexOf(neighbor), 1);
          }
        }
        for (let neighbor of [...neighbors]) {
          if (neighbor[neighbor.length - 1] == "*") {
            let i = neighbors.indexOf(neighbor);
            let n = neighbors[i];
            n = n.replace("*", "");
            n = n.toLowerCase();
            neighbors[i] = n;
          }
        }
    
        // append neighbors to currentPath and add each new path to the stack.
        for (let neighbor of neighbors) {
          stack.push([...currentPath, neighbor]);
        }
      }
  
    }
    stack = [[origin]];
  }

  return _allPaths;
}
*/

/*
function allPaths2(origin, finish, graph) {
  let stack = [[origin]];
  const _allPaths = [];

  // loop through all nodes.  If node is lowercase and not start/end, then
  // increase visits to 2.  
  // Then run while below.
  for (const [sourceNode, _] of graph) {
    const graphClone = graphCopy(graph);
    const visitsLeft = constructVisits(graph);
    
    if (/[a-z]/.test(sourceNode) && !['start', 'end'].includes(sourceNode)) {
      visitsLeft.set(sourceNode, 2);
    }
    
    // add newfound paths to _allPaths.
    while (stack.length > 0) {
      let currentPath = stack.pop();
      let current = currentPath[currentPath.length - 1];
      visitsLeft.set(current, visitsLeft.get(current) - 1);
      
      // append to return value if found a path to finish.
      let newPath = !_allPaths.map(e => e.join()).includes(currentPath.join());
      if (current == finish && newPath) {
        _allPaths.push(currentPath);
      }
      else {
        // don't go back to lowercase neighbors that have already been visited.
        let neighbors = [...graph.get(current)]; // need new set, so that the set in graph isn't altered.
        for (let neighbor of [...neighbors]) {
          if (currentPath.includes(neighbor) && /[a-z]/.test(neighbor)) {
            neighbors.splice(neighbors.indexOf(neighbor), 1);
          } else if (/[a-z]/.test(neighbor) && visitsLeft.get(neighbor) == 0) {
            neighbors.splice(neighbors.indexOf(neighbor), 1);
          }
        }
        
        // append neighbors to currentPath and add each new path to the stack.
        for (let neighbor of [...neighbors]) {
          stack.push([...currentPath, neighbor]);
        }
      }
    }
    stack = [[origin]];
  }

  return _allPaths;
}
*/