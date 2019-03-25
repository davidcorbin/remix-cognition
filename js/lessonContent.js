function lessonContent () {
  let Store = require('electron-store')
  let store = new Store()

  const DataFile = require('./js/DataFile.js')
  const df = new DataFile()

  const LESSON_FILE = df.getLessonFile()

  var lessonID = window.location.hash.substring(1)
  var started = store.get('started')
  var finished = store.get('finished')
  if (!Array.isArray(finished) || !finished.length) { finished = [] }
  if (!Array.isArray(started) || !started.length) { started = [] }
  if (!started.includes(lessonID) && !finished.includes(lessonID)) {
    started.push(lessonID)
  }
  store.set('started', started)
  const ol = document.getElementById('lessonPages')

  // file I/O
  const fs = require('fs')
  let rawdata = fs.readFileSync(LESSON_FILE)
  let allLessons = JSON.parse(rawdata)
  allLessons.forEach(function (element) {
    if (element.id.toString() === lessonID) {
      document.getElementById('lessonContent').innerHTML = element.name
      element.sources.forEach(function (source, i) {
        const ifram = document.createElement('iframe')
        ifram.src = source.url

        const individualLessonDiv = document.createElement('div')
        individualLessonDiv.className = 'individualLesson'
        const lessonTitle = document.createElement('h3')
        lessonTitle.innerText = i + 1 + '. ' + source.title
        individualLessonDiv.append(lessonTitle)
        individualLessonDiv.append(ifram)
        ol.append(individualLessonDiv)
      })
    }
  })

  document.getElementById('finishLesson').addEventListener('click', function () {
    var started = store.get('started')
    if (!Array.isArray(started) || !started.length) { started = [] }
    let filtered = started.filter(lesson => lesson !== lessonID)
    store.set('started', filtered)
    var finished = store.get('finished')
    if (!Array.isArray(finished) || !finished.length) { finished = [] }
    if (!finished.includes(lessonID.toString())) {
      finished.push(lessonID)
    }
    store.set('finished', finished)
    window.location.href = 'index.html'
  })

  document.getElementById('gotoQuiz').addEventListener('click', function () {
    window.location.href = 'exam.html#Q' + lessonID
  })
}
lessonContent()
