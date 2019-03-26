const path = require('path')
class dataFile {
  constructor () {
    this.isDev = process.mainModule.filename.indexOf('app.asar') === -1
  }
  getLessonFile () {
    return this.autoGetPath('./data/lessons/lessons.json')
  }
  getSectionsFile () {
    return this.autoGetPath('./data/sections.json')
  }
  getQuestionsFile (quizNum) {
    return this.autoGetPath('./data/questions/' + quizNum + '.json')
  }
  autoGetPath (filename) {
    if (this.isDev) {
      return filename
    }
    return path.join(process.resourcesPath, filename)
  }
}

module.exports = dataFile
