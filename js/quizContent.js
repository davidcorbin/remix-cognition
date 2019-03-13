function quizContent () {
  let Store = require('electron-store')
  let store = new Store()

  const SECTION_FILE = './data/sections.json'
  const fs = require('fs')
  const SECTION_DATA = JSON.parse(fs.readFileSync(SECTION_FILE))

  var examID = window.location.hash.substring(1)
  document.getElementById('examNum').innerHTML = examID

  // This line is a bit sketch, we should have better way of getting the element of array
  var lessonsCovered = SECTION_DATA.sections[examID - 1].lessons
  document.getElementById('lessonsCovered').innerHTML = lessonsCovered

  document.getElementById('finishExam').addEventListener('click', function () {
    var finished = store.get('examsFinished')
    if (!Array.isArray(finished) || !finished.length) { finished = [] }
    if (!finished.includes(examID.toString())) {
      finished.push(examID)
    }
    store.set('examsFinished', finished)
    window.location.href = 'index.html'
  })
}
quizContent()
