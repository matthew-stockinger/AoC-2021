const testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

const mainInput = `FPNFCVSNNFSFHHOCNBOB

ON -> S
SO -> B
OH -> C
SN -> F
BP -> O
SK -> F
OO -> K
CF -> O
PP -> F
KS -> K
KN -> B
BN -> H
HN -> H
NP -> P
BB -> N
SB -> F
BH -> V
NV -> S
PO -> S
CN -> N
VP -> B
HH -> B
NB -> V
NF -> O
BV -> B
CV -> B
SS -> H
CB -> C
VN -> S
FH -> K
BF -> H
NH -> P
PV -> K
OP -> F
HO -> N
SH -> C
VH -> P
VK -> B
OF -> F
KK -> B
SC -> H
CO -> S
BK -> V
PF -> B
OK -> K
FO -> V
CH -> O
KO -> B
CS -> V
OC -> P
SP -> V
KF -> C
HV -> S
KH -> B
VS -> K
KB -> F
FF -> P
VF -> H
NC -> S
HB -> V
NN -> C
FV -> B
PH -> V
KV -> C
PB -> C
OS -> O
PS -> H
FS -> N
FP -> O
VV -> O
FN -> V
NO -> K
NK -> V
OB -> F
PC -> O
OV -> H
FK -> C
HS -> F
SF -> N
VC -> C
BS -> N
PK -> O
FB -> S
CK -> B
KP -> N
KC -> F
BC -> F
HK -> H
VO -> O
NS -> B
VB -> K
FC -> K
SV -> O
HF -> H
HC -> C
CP -> O
CC -> P
PN -> P
HP -> C
BO -> F`;

function parseTemplate(input) {
  return input.slice(0, input.indexOf('\n'));
}
function parseRules(input) {
  return input.split('\n')
    .slice(2)
    .reduce((prev, curr) => {
      let pairCode = curr.slice(0, curr.indexOf('-') - 1);
      prev[pairCode] = curr.slice(curr.indexOf('>') + 2);
      return prev;
    }, {});
}

function polymerize(template, rules) {
  console.time("polymerize timer");
  // make list of pairs from template.
  const pairs = [];
  for (let i = 0; i < template.length - 1; i++) {
    pairs.push(template[i] + template[i + 1]);
  }
  // make list of characters to insert into template.
  const insertChars = pairs.map(pair => rules[pair]);

  // apply insertion rules.
  let polymerized = template;
  for (let i = template.length - 1; i > 0; i--) {
    polymerized.splice(i, 0, insertChars[i - 1]);
  }
  console.timeEnd("polymerize timer");
  return polymerized;
}

function runPolymerSteps(template, rules, howMany) {
  let stepResult = template;
  for (let i = 0; i < howMany; i++) {
    stepResult = polymerize(stepResult, rules);
  }
  return stepResult;
}

function maxMin(arr) {
  let histogram = [];
  for (const char of new Set(arr)) {
    histogram.push(arr.filter(e => e == char).length);
  }
  histogram.sort((a,b) => a - b);
  return histogram[histogram.length - 1] - histogram[0];
}


// const template = parseTemplate(testInput).split("");
// const rules = parseRules(testInput);
// const tenSteps = runPolymerSteps(template, rules, 10);

// console.log(maxMin(tenSteps));

/********** Part 2 ************ */

function letterCount(templateString, rules) {
  const res = {};

  // what letters are possible from this input?
  const letters = new Set();
  for (const letter of Object.values(rules)) {
    letters.add(letter);
  }

  for (const char of letters) {
    res[char] = 0;
  }

  for (const char of templateString) {
    if (res[char]) res[char] += 1;
    else res[char] = 1;
  }
  return res;
}

function initPairCount(template, rules) {
  const res = {};
  for (const pair of Object.keys(rules)) {
    res[pair] = 0;
  }
  for (let i = 0; i < template.length - 1; i++) {
    let pair = template[i] + template[i + 1];
    res[pair] += 1;
  }
  return res;
}

// returns new {letterCounts: letterCounts, pairCounts: pairCounts}
function polymerize2([letterCounts, pairCounts]) {
  const prevPairCounts = pairCounts[pairCounts.length - 1];
  const currPairCounts = {};
  const prevCounts = letterCounts[letterCounts.length - 1];
  const currCounts = {};
  for (const pair of Object.keys(prevPairCounts)) {
    const lett = rules[pair];
    // first compute new letter counts
    if (currCounts[lett]) {
      currCounts[lett] += prevPairCounts[pair];
    } else {
      currCounts[lett] = prevCounts[lett] + prevPairCounts[pair];
    }

    // now compute new pairCounts.
    const p1 = pair[0] + lett;
    const p2 = lett + pair[1];
    if (currPairCounts[p1]) {
      currPairCounts[p1] += prevPairCounts[pair];
    } else {
      currPairCounts[p1] = prevPairCounts[pair];
    }
    if (currPairCounts[p2]) {
      currPairCounts[p2] += prevPairCounts[pair];
    } else {
      currPairCounts[p2] = prevPairCounts[pair];
    }
  }

  return [[...letterCounts, currCounts], [...pairCounts, currPairCounts]];
}


const template = parseTemplate(mainInput).split("");
const rules = parseRules(mainInput);
const letterCounts = [letterCount(template, rules)];
const pairCounts = [initPairCount(template, rules)];
// const step1 = polymerize2([letterCounts, pairCounts]);
// const step2 = polymerize2(step1);
// console.log(step1);
// console.log(step2);
let step = [letterCounts, pairCounts];
for (let i = 0; i < 40; i++) {
  step = polymerize2(step);
}

let histogram = [...Object.values(step[0][40])];
histogram.sort((a, b) => a - b);
console.log(histogram[histogram.length - 1] - histogram[0]);
