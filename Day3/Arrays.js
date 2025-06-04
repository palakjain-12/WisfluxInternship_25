// Array Creation and Access
let fruits = ["apple", "banana", "mango"];
console.log(fruits[0]);
console.log(fruits[1]);

// Array Length
console.log(fruits.length);

// push – add to end
fruits.push("orange");
console.log(fruits);

// pop – remove from end
fruits.pop();
console.log(fruits);

// unshift – add to start
fruits.unshift("grapes");
console.log(fruits);

// shift – remove from start
fruits.shift();
console.log(fruits);

// indexOf – get index
console.log(fruits.indexOf("banana"));

// includes – check existence
console.log(fruits.includes("mango"));

// slice – extract portion (non-mutating)
let slicedFruits = fruits.slice(0, 2);
console.log(slicedFruits);

// splice – remove/replace/add elements (mutating)
fruits.splice(1, 1, "kiwi");
console.log(fruits);

// concat – merge arrays
let tropical = ["pineapple", "papaya"];
let allFruits = fruits.concat(tropical);
console.log(allFruits);

// join – convert array to string
console.log(fruits.join(", "));

// reverse – reverse array
fruits.reverse();
console.log(fruits);

// sort – sort array
fruits.sort();
console.log(fruits);

// forEach – loop through array
fruits.forEach(function(fruit) {
  console.log("forEach:", fruit);
});

// map – transform array using normal function
let upperFruits1 = fruits.map(function(fruit) {
  return fruit.toUpperCase();
});
console.log(upperFruits1);

// Arrow Function Usage

// forEach using arrow function
fruits.forEach(fruit => console.log("forEach (arrow):", fruit));

// map using arrow function
let upperFruits2 = fruits.map(fruit => fruit.toUpperCase());
console.log(upperFruits2);

// filter using arrow function
let filtered = fruits.filter(fruit => fruit.includes("a"));
console.log(filtered);

// reduce using arrow function
let numbers = [1, 2, 3, 4];
let sum = numbers.reduce((acc, val) => acc + val, 0);
console.log(sum);

// find – return first match
let found = fruits.find(fruit => fruit.startsWith("k"));
console.log(found);

// every – check if all elements match condition
console.log(numbers.every(num => num > 0));

// some – check if any element matches condition
console.log(numbers.some(num => num > 3));
