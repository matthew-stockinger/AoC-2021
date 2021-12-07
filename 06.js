const testInput = `3,4,3,1,2`;

const mainInput = `3,5,1,5,3,2,1,3,4,2,5,1,3,3,2,5,1,3,1,5,5,1,1,1,2,4,1,4,5,2,1,2,4,3,1,2,3,4,3,4,4,5,1,1,1,1,5,5,3,4,4,4,5,3,4,1,4,3,3,2,1,1,3,3,3,2,1,3,5,2,3,4,2,5,4,5,4,4,2,2,3,3,3,3,5,4,2,3,1,2,1,1,2,2,5,1,1,4,1,5,3,2,1,4,1,5,1,4,5,2,1,1,1,4,5,4,2,4,5,4,2,4,4,1,1,2,2,1,1,2,3,3,2,5,2,1,1,2,1,1,1,3,2,3,1,5,4,5,3,3,2,1,1,1,3,5,1,1,4,4,5,4,3,3,3,3,2,4,5,2,1,1,1,4,2,4,2,2,5,5,5,4,1,1,5,1,5,2,1,3,3,2,5,2,1,2,4,3,3,1,5,4,1,1,1,4,2,5,5,4,4,3,4,3,1,5,5,2,5,4,2,3,4,1,1,4,4,3,4,1,3,4,1,1,4,3,2,2,5,3,1,4,4,4,1,3,4,3,1,5,3,3,5,5,4,4,1,2,4,2,2,3,1,1,4,5,3,1,1,1,1,3,5,4,1,1,2,1,1,2,1,2,3,1,1,3,2,2,5,5,1,5,5,1,4,4,3,5,4,4`;

// days is number of days to run the sim.
function runSim(input, days) {
  fishes = input.split(",").map(elt => Number(elt));

  // decrement each value until 0.
  // if a value is 0, change that to a 6 and push an 8 to the end.
  for (let j = 0; j < days; j++) {
    fishes.forEach((fish, i, arr) => {
      if (fish > 0) arr[i]--;
      else if (fish == 0) {
        arr[i] = 6;
        arr.push(8);
      } else {
        throw new Error();
      }
    });
  }
  console.log(fishes.length);

}

// runSim(testInput, 80);
// runSim(mainInput, 80);

/************** Part 2 ******************** */
// fishes array is now 9 elements long.
// each element represents the number of fish of age = index.
// a day in the sim: shift all elements one index left (all fish get one day older)
// The # of fish at age 0 will then be added to indices 6 and 8.
function runSim2(input, days) {
  // parse input.  Set up array.
  let inputArr = input.split(",").map(elt => Number(elt));
  let fishes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let age of inputArr) {
    fishes[age]++;
  }

  // for each day
  for (let i = 0; i < days; i++) {
    let zeroes = fishes[0];
    for (let age = 1; age < 9; age++) {
      fishes[age - 1] = fishes[age];
    }
    fishes[8] = 0;
    fishes[6] += zeroes;
    fishes[8] = zeroes;
  }

  // how many fish are there now?
  return fishes.reduce((a, b) => a + b);
}

console.log(runSim2(mainInput, 256));