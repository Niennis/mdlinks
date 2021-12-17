// const mdLinks = require('../');
const { mdLinks } = require('../src/api.js');
const { isStats } = require('../src/stats.js');

const routeDir = '/home/fanny/Documentos/Estudio/04-md-links/test/testdirectory';
const routeFile = './test/testdirectory/testfile.md';
const wrongRoute = './test/wrong';
const emptyDir = './test/testdirectory/dirwithoutfiles';
const emptyFile = './test/testdirectory/filewithoutlinks.md'
const fileWithoutPermission = '/home/fanny/noviembre/viernes.md'
const dirWithoutPermission = '/home/fanny/noviembre'

describe('mdLinks', () => {

  it('mdLinks should be a function', () => {
    expect(typeof mdLinks).toBe('function')
  })

  it('should return an array of objects with properties file, href and text', async () => {
    const response = [
      {
        "file": "/home/fanny/Documentos/Estudio/04-md-links/test/testdirectory/testfile.md",
        "href": "https://es.wikipedia.org/wiki/Markdown",
        "text": "con un link"
      },
      {
        "file": "/home/fanny/Documentos/Estudio/04-md-links/test/testdirectory/testfile.md",
        "href": "https://www.lego.com/en-us/not-found",
        "text": "link malo tb"
      }
    ]
    await expect(mdLinks(routeDir)).resolves.toEqual(response);
  });

  it('should throw "Ruta inválida" if wrong route', async () => {
    await expect(mdLinks(wrongRoute)).rejects.toMatch('La ruta no existe');
  })

  it('should return "No se pudo leer el archivo', async () => {
    await expect(mdLinks(fileWithoutPermission)).rejects.toMatch('No se pudo leer el archivo');
  })

  it('should return "No se pudo leer el directorio', async () => {
    await expect(mdLinks(dirWithoutPermission)).rejects.toMatch('No se pudo leer el directorio');
  })

  it('should return "No existen archivos md', async () => {
    await expect(mdLinks(emptyDir)).rejects.toMatch('No existen archivos md');
  })

  it('should return "No se encontraron links', async () => {
    await expect(mdLinks(emptyFile)).rejects.toMatch('No se encontraron links');
  })

  it('response should includes status and ok if validate = true', async () => {
    const response = [
      {
        "file": "/home/fanny/Documentos/Estudio/04-md-links/test/testdirectory/testfile.md",
        "href": "https://es.wikipedia.org/wiki/Markdown",
        "ok": "ok",
        "status": 200,
        "text": "con un link"
      },
      {
        "file": "/home/fanny/Documentos/Estudio/04-md-links/test/testdirectory/testfile.md",
        "href": "https://www.lego.com/en-us/not-found",
        "ok": "fail",
        "status": 404,
        "text": "link malo tb"
      }
    ]

    await expect(mdLinks(routeDir, { validate: true })).resolves.toEqual(response);
  });

  it('if validate false and stats true should return total and unique', async () => {
    await expect(isStats(routeDir, true)).resolves.toEqual({ "broken": 2, "total": 2, "unique": 2 });
  })

  it('if validate false and stats true should return total and unique', async () => {
    await expect(isStats(routeDir, false)).resolves.toEqual({ "total": 2, "unique": 2 });
  })

})