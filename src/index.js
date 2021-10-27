const mdLinks = require('./api.js')

const route = process.argv[2];

mdLinks.mdLinks(route, { validate: true })
  .then(data => console.log('mdlinks', data))
  .catch(err => console.log(err))