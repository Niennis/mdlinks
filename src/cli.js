#!/usr/bin/env node
const mdLinks = require('./api.js');
const isStats = require('./stats.js');

const [...args] = process.argv;

if(args.includes('--validate') && args.includes('--stats') && args[2]){
  isStats.isStats(args[2], true)
    .then(response => {
        console.log(`Total: ${response.total}`)
        console.log(`Unique: ${response.unique}`)
        console.log(`Broken: + ${response.broken}`)
    })
} else if(!args.includes('--validate') && !args.includes('--stats')  && args[2]){
  mdLinks.mdLinks(args[2], { validate: false })
  .then(data => {
    data.forEach(element => {
      console.log(`${element.file} ${element.href} ${element.text}`)
    });
  })
  .catch(err => console.log(err))
} else if(args.includes('--validate') && args[2]){
  mdLinks.mdLinks(args[2], { validate: true })
  .then(data => {
    data.forEach(element => {
      console.log(`${element.file} ${element.href} ${element.ok} ${element.status} ${element.text}`)
    });
  })
} else if(args.includes('--stats') && args[2]){
  isStats.isStats(args[2], false)
  .then(response => {
      console.log(`Total: ${response.total}`)
      console.log(`Unique: ${response.unique}`)
  })
} else {
  console.log(`no pasó nah`)
}