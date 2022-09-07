const mdLinks = require('./index.js')

const isStats = (route, stats) => {
  return new Promise((resolve, reject) => {
    mdLinks.mdLinks(route, { validate: true })
      .then(data => {
        const links = []
        data.forEach(item => {
          links.push(item.href)
        });

        if (stats === false) {
          resolve({
            total: links.length,
            unique: new Set(links).size
          })
        } else {
          resolve({
            total: links.length,
            unique: new Set(links).size,
            broken: data.filter(item => item.ok !== `ok`).length
          })
        }
      })
      .catch(() => reject(`Algo salió mal`))
  })
}

module.exports = {
  isStats
};
