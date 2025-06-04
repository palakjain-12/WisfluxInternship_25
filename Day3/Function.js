// Function to filter users by age and return formatted names
function getEligibleUsers(users, minAge) {
  return users
    .filter(user => user.age >= minAge)               
    .map(user => `${user.name} (${user.age} years)`); 
}

const userList = [
  { name: "Palak", age: 20 },
  { name: "Riya", age: 17 },
  { name: "John", age: 25 },
  { name: "Ankit", age: 16 }
];


const adults = getEligibleUsers(userList, 18);

console.log("Eligible Users:");
console.log(adults);
