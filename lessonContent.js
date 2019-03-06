function lessonContent () {
  let Store = require('electron-store')
  let store = new Store()

  var lessonID = window.location.hash.substring(1)
  var started = store.get('started')
  var finished = store.get('finished')
  if (!Array.isArray(finished) || !finished.length) { finished = [] }
  if (!Array.isArray(started) || !started.length) { started = [] }
  if (!started.includes(lessonID) && !finished.includes(lessonID)) {
    started.push(lessonID)
  }
  store.set('started', started)
  // document.getElementById('lessonContent').innerHTML = lessonName
  const ol = document.getElementById('lessonPages')
  // file I/O
  const fs = require('fs')
  let rawdata = fs.readFileSync('./data/lessons/lessons.json')
  let allLessons = JSON.parse(rawdata)
  allLessons.forEach(function (element) {
    if (element.id.toString() === lessonID) {
      document.getElementById('lessonContent').innerHTML = element.name
      element.sources.forEach(function (source) {
        const li = document.createElement('li')
        const sourceLabel = document.createElement('label')
        sourceLabel.innerHTML = source.title
        const listButton = document.createElement('button')
        listButton.innerHTML = source.url
        li.appendChild(sourceLabel)
        li.appendChild(listButton)
        ol.appendChild(li)
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
}
lessonContent()
