// STRING METHODS

let str = "  Hello JavaScript!  ";

// length
console.log("Length:", str.length);

// trim
let trimmed = str.trim();
console.log("Trimmed:", trimmed);

// toUpperCase
console.log("Uppercase:", trimmed.toUpperCase());

// toLowerCase
console.log("Lowercase:", trimmed.toLowerCase());

// indexOf
console.log("Index of 'Script':", trimmed.indexOf("Script"));

// slice
console.log("Slice (6, 16):", trimmed.slice(6, 16));

// substring
console.log("Substring (0, 5):", trimmed.substring(0, 5));

// replace
console.log("Replace 'JavaScript' with 'World':", trimmed.replace("JavaScript", "World"));

// split
let words = trimmed.split(" ");
console.log("Split into words:", words);

// charAt
console.log("Character at index 1:", trimmed.charAt(1));

// startsWith
console.log("Starts with 'Hello':", trimmed.startsWith("Hello"));

// endsWith
console.log("Ends with '!':", trimmed.endsWith("!"));


