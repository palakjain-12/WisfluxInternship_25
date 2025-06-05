const textPara = document.getElementById("text");
const inputField = document.getElementById("inputField");
const changeBtn = document.getElementById("changeBtn");


changeBtn.addEventListener("click", () => {
  const newText = inputField.value;
  textPara.textContent = newText || "No input provided!";
});

let colorBtn = document.querySelector("#colorBtn");
let body = document.querySelector("body");
let currMode= "light";
colorBtn.addEventListener("click", () => {
    if (currMode==="light"){
        currMode="dark";
        body.classList.add("dark");
        body.classList.remove("light")
    } else{
        currMode="light";
        body.classList.add("light");
        body.classList.remove("dark")
    }
    console.log(currMode)
});

let doc = document.getElementById("text");
console.log(doc);