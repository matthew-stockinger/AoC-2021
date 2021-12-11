const testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

const testInput2 = `11111
19991
19191
19991
11111`;

const mainInput = `7232374314
8531113786
3411787828
5482241344
5856827742
7614532764
5311321758
1255116187
5821277714
2623834788`;

/* Part 1
---------
const cavern = octopusCavern(mainInput);
// console.log("before steps:\n", cavern.join("\n"));
let totalFlashes = 0;
for (let i = 1; i <= 100; i++) {
  totalFlashes += step(cavern);
}
// console.log(`after step 100:\n`, cavern.join("\n"));
console.log(totalFlashes);
*/

/* Part 2
--------- */
const cavern = octopusCavern(mainInput);
for (let i = 1; i <= 500; i++) {
  if (step2(cavern)) {
    console.log(`synchronization at step ${i}!`);
  }
}




/******* Part 2 Functions ************ */
// reconfigured the step function to return true or false
// true means full synchronized flash.
function step2(cavern) {
  let flashes = [];
  // phase 1.
  for (let row = 0; row < cavern.length; row++) {
    for (let col = 0; col < cavern[0].length; col++) {
      if (cavern[row][col] < 10) cavern[row][col]++;
      if (cavern[row][col] == 10) {
        flashes.push({row: row, col: col});
      }
    }
  }

  // phase 2.
  while (flashes.length > 0) {
    let {row, col} = flashes.pop();
    // top left
    if (cavern[row - 1] && cavern[row - 1][col - 1] < 10) {
      cavern[row - 1][col - 1]++;
      if (cavern[row - 1][col - 1] == 10) {
        flashes.push({row: row - 1, col: col - 1});
      }
    }
    // top middle
    if (cavern[row - 1] && cavern[row - 1][col] < 10) {
      cavern[row - 1][col]++;
      if (cavern[row - 1][col] == 10) {
        flashes.push({row: row - 1, col: col});
      }
    }
    // top right
    if (cavern[row - 1] && cavern[row - 1][col + 1] < 10) {
      cavern[row - 1][col + 1]++;
      if (cavern[row - 1][col + 1] == 10) {
        flashes.push({row: row - 1, col: col + 1});
      }
    }
    // left
    if (cavern[row][col - 1] < 10) {
      cavern[row][col - 1]++;
      if (cavern[row][col - 1] == 10) {
        flashes.push({row: row, col: col - 1});
      }
    }
    // right
    if (cavern[row][col + 1] < 10) {
      cavern[row][col + 1]++;
      if (cavern[row][col + 1] == 10) {
        flashes.push({row: row, col: col + 1});
      }
    }
    // bottom left
    if (cavern[row + 1] && cavern[row + 1][col - 1] < 10) {
      cavern[row + 1][col - 1]++;
      if (cavern[row + 1][col - 1] == 10) {
        flashes.push({row: row + 1, col: col - 1});
      }
    }
    // botom middle
    if (cavern[row + 1] && cavern[row + 1][col] < 10) {
      cavern[row + 1][col]++;
      if (cavern[row + 1][col] == 10) {
        flashes.push({row: row + 1, col: col});
      }
    }
    // botom right
    if (cavern[row + 1] && cavern[row + 1][col + 1] < 10) {
      cavern[row + 1][col + 1]++;
      if (cavern[row + 1][col + 1] == 10) {
        flashes.push({row: row + 1, col: col + 1});
      }
    }
  }

  // phase 3.  count total flashes this step, too.
  let numFlashes = 0;
  for (let row = 0; row < cavern.length; row++) {
    for (let col = 0; col < cavern[0].length; col++) {
      if (cavern[row][col] == 10) {
        cavern[row][col] = 0;
        numFlashes++;
      }
    }
  }

  return numFlashes == cavern.length * cavern[0].length;
}

/******* Part 1 Functions ************ */

// phase 1: increment.  identify flashes and add to the stack.
// phase 2: process flashes in the stack.  Add new ones as they arise.
// phase 3: replace flashes with 0's in the matrix.
function step(cavern) {
  let flashes = [];
  let numFlashes = 0;
  // phase 1.
  for (let row = 0; row < cavern.length; row++) {
    for (let col = 0; col < cavern[0].length; col++) {
      if (cavern[row][col] < 10) cavern[row][col]++;
      if (cavern[row][col] == 10) {
        flashes.push({row: row, col: col});
        numFlashes++;
      }
    }
  }

  // phase 2.
  while (flashes.length > 0) {
    let {row, col} = flashes.pop();
    // top left
    if (cavern[row - 1] && cavern[row - 1][col - 1] < 10) {
      cavern[row - 1][col - 1]++;
      if (cavern[row - 1][col - 1] == 10) {
        flashes.push({row: row - 1, col: col - 1});
        numFlashes++;
      }
    }
    // top middle
    if (cavern[row - 1] && cavern[row - 1][col] < 10) {
      cavern[row - 1][col]++;
      if (cavern[row - 1][col] == 10) {
        flashes.push({row: row - 1, col: col});
        numFlashes++;
      }
    }
    // top right
    if (cavern[row - 1] && cavern[row - 1][col + 1] < 10) {
      cavern[row - 1][col + 1]++;
      if (cavern[row - 1][col + 1] == 10) {
        flashes.push({row: row - 1, col: col + 1});
        numFlashes++;
      }
    }
    // left
    if (cavern[row][col - 1] < 10) {
      cavern[row][col - 1]++;
      if (cavern[row][col - 1] == 10) {
        flashes.push({row: row, col: col - 1});
        numFlashes++;
      }
    }
    // right
    if (cavern[row][col + 1] < 10) {
      cavern[row][col + 1]++;
      if (cavern[row][col + 1] == 10) {
        flashes.push({row: row, col: col + 1});
        numFlashes++;
      }
    }
    // bottom left
    if (cavern[row + 1] && cavern[row + 1][col - 1] < 10) {
      cavern[row + 1][col - 1]++;
      if (cavern[row + 1][col - 1] == 10) {
        flashes.push({row: row + 1, col: col - 1});
        numFlashes++;
      }
    }
    // botom middle
    if (cavern[row + 1] && cavern[row + 1][col] < 10) {
      cavern[row + 1][col]++;
      if (cavern[row + 1][col] == 10) {
        flashes.push({row: row + 1, col: col});
        numFlashes++;
      }
    }
    // botom right
    if (cavern[row + 1] && cavern[row + 1][col + 1] < 10) {
      cavern[row + 1][col + 1]++;
      if (cavern[row + 1][col + 1] == 10) {
        flashes.push({row: row + 1, col: col + 1});
        numFlashes++;
      }
    }
  }

  // phase 3.
  for (let row = 0; row < cavern.length; row++) {
    for (let col = 0; col < cavern[0].length; col++) {
      if (cavern[row][col] == 10) cavern[row][col] = 0;
    }
  }

  return numFlashes;
}

function octopusCavern(input) {
  return input.split("\n")
    .map(line => line.split("").map(e => Number(e)));
}