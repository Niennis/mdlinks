const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const { resolve } = require('path');
const renderer = new marked.Renderer();
const testRoute = process.argv[2];

const readDirectory = (route) => {
  return new Promise((resolve, reject) => {
    fs.readdir(route, (err, filenames) => {
      let arr = [];
      if (err) {
        reject('No pudo leer el directorio')
      } else {
        filenames.forEach(file => {
          // if (file.substr(-3) == '.md') {
          arr.push(path.resolve(route) + `/${file}`)
          // }
        })
      }
      resolve(arr)
    })
  })
}
/* readDirectory(testRoute)
  .then(data => console.log(data))
  .catch(err => console.log(err))
 */

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      let arr = [];
      if (err) {
        reject('error')
      } else {
        renderer.link = (href, title, text) => {
          arr.push({
            text: text,
            href: href,
            file: file,
          })
        }
        marked(data, { renderer })

        resolve(arr)
      }
    })
  })
}
/* readFile(process.argv[2])
  .then(data => console.log('data', data))
  .catch(err => console.log(err)) */

const fileOrDirectory = (route) => {
  return new Promise((resolve, reject) => {
    const promises = [];
    fs.stat(route, (err, stats) => {
      if (err) { reject('Ruta inválida') };

      if (stats.isDirectory()) {
        readDirectory(route).then(files => {
          // files es array de rutas
          // files.push(fileOrDirectory(file))
          files.forEach(file => {
            // console.log('file', file)
            promises.push(fileOrDirectory(file))
          })
          resolve(Promise.all(promises).then(response => response.flat()))
        })
      } else {
        resolve([path.resolve(route)])
      }
    })
  })
}

const isMd = (arr) => {
  return arr.filter(el => path.extname(el) === '.md')
}

const isValid = (links) => {
  return new Promise((resolve, reject) => {
    const arr = links.map(item => {
      return fetch(item.href)
        .then((res) => {
          return ({
            ...item,
            status: res.status,
            ok: res.status < 300 ? 'ok' : 'fail'
          })
        })
        .catch(() => {
          reject('No encontró la ruta');
        });
    })
    resolve(Promise.all(arr))
  })
}

const mdLinks = (route, option = { validate: false }) => {
  return new Promise((resolve, reject) => {
    fileOrDirectory(route)
      .then(data => isMd(data))
      .then(data => {
        let arr = [];
        data.forEach(item => {
          arr.push(readFile(item))
        })
        return Promise.all(arr)
      })
      .then(data => {
        if (option.validate === false) {
          resolve(data.flat())
        } else {
          resolve(isValid(data.flat()).then(data => data).catch(err => err))
        }
      })
      .catch(err => reject(err))
  })
}


module.exports = {
  mdLinks
};
