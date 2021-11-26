const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const { resolve } = require('path');
const renderer = new marked.Renderer();

const absoluteRoute = route => path.resolve(route);

const exists = route => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(route)) {
      resolve(route)
    } else {
      reject(`La ruta no existe`)
    }
  })
}

const readDirectory = route => {
  return new Promise((resolve, reject) => {
    fs.readdir(route, (err, filenames) => {
      let arr = [];
      if (err) {
        reject('No pudo leer el directorio')
      } else {
        filenames.forEach(file => {
          arr.push(path.resolve(route) + `/${file}`)
        })
      }
      resolve(arr)
    })
  })
}

const readFile = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      let arr = [];
      if (err) {
        reject('No se pudo leer el archivo')
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

const fileOrDirectory = route => {
  return new Promise((resolve, reject) => {
    const promises = [];
    fs.stat(route, (err, stats) => {
      if (err) {
        reject('Ruta inválida')
      } else {
        if (stats.isDirectory()) {
          readDirectory(route).then(files => {
            files.forEach(file => promises.push(fileOrDirectory(file)))
            resolve(Promise.all(promises).then(response => response.flat()))
          })
        } else {
          resolve([path.resolve(route)])
        }
      }
    })
  })
}

const getMdFiles = arr => {
  return new Promise((resolve, reject) => {
    const response = arr.filter(el => path.extname(el) === '.md');
    if(response.length > 0) {
      resolve(response)
    } else {
      reject('No existen archivos md')
    }
  })

}

const isValid = links => {
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
          reject('Hubo un problema con la ruta');
        });
    })

    resolve(Promise.all(arr))
  })
}

const mdLinks = (route, option = { validate: false }) => {
  return new Promise((resolve, reject) => {
    exists(absoluteRoute(route))
      .then(() => fileOrDirectory(route))    
      .then(data => getMdFiles(data))
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
