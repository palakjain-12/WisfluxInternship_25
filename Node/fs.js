const fs= require('fs');
// fs.readFile('file.txt','utf8',(err,data)=>{
//     console.log(err,data)
// })
// console.log("finished reading file")

// fs.writeFile('file.txt',"this is a data",()=>{
//     console.log("written to the file")
// })

const a = fs.readFileSync('file.txt')
console.log(a.toString())
