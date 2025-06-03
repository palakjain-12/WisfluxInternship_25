// FOR LOOP
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        console.log(i, "is Even");
    } else {
        console.log(i, "is Odd");
    }
}

// FOR...OF LOOP
let colors = ["red", "green", "blue"];

for (let color of colors) {
    console.log("For...of:", color);
}

// FOR...IN LOOP
let person = { name: "Palak", age: 20, country: "India" };

for (let key in person) {
    console.log("Key =", key, "Value =", person[key]);
}

// WHILE LOOP
let count = 1;

while (count <= 30) {
    if (count % 3 === 0) {
        console.log("Multiple of 3:", count);
    }
    count++;
}

// DO-WHILE LOOP – COUNTDOWN FROM 5
let j = 5;

do {
    console.log("Countdown:", j);
    j--;
} while (j > 0);