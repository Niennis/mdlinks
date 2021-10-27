// const mdLinks = require('../');
const mdLinks = require('../src/index.js')

describe('mdLinks', () => {

  it('readDirectory should be a function', () => {
    expect(typeof mdLinks.readDirectory).toBe('function')
  })

  it('readDirectory should return an array of files', async () => {
    const data = await mdLinks.readDirectory('./src/dirTest');
    expect(data).toEqual(['/home/fanny/Documentos/Estudio/04-md-links/src/dirTest/secondMD.md']);
  });

  it('should throw err', async () => {
    // expect.assertions(1);
    try {
      await mdLinks.readDirectory('./src/wrongDir');
    } catch (e) {
      return expect(e).toMatch('error');
    }
  })

  it('mdLinks.readFile should be a function', () => {
    expect(typeof mdLinks.readFile).toBe('function')
  })

  const testDir = ['/home/fanny/Documentos/Estudio/04-md-links/src/dirTest/secondMD.md']
  const testDirWrong = ['/home/fanny/Documentos/Estudio/04-md-links/src/dirTest/secondMDL.md']
  const expected = [{
    "href": "https://es.wikipedia.org/wiki/Markdown",
    "text": "con un link",
  },
  {
    "href": "https.//es.wiki.com",
    "text": "link malo tb",
  }]

  it('readFile should return an array of files', async () => {
    const data = await mdLinks.readFile(testDir);
    expect(data).toEqual(expected);
  });

  it('should throw err', async () => {
    // expect.assertions(1);
    try {
      await mdLinks.readFile(testDirWrong);
    } catch (e) {
      return expect(e).toMatch('error');
    }
  })
})