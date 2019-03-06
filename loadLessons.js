function loadLessons () {
  let Store = require('electron-store')
  let store = new Store()

  var started = store.get('started')
  if (!Array.isArray(started) || !started.length) { started = [] }
  var finished = store.get('finished')
  if (!Array.isArray(finished) || !finished.length) { finished = [] }
  const fs = require('fs')
  let rawdata = fs.readFileSync('./data/lessons/lessons.json')
  let allLessons = JSON.parse(rawdata)
  const ol = document.getElementById('lessons')
  allLessons.forEach(function (element) {
    const li = document.createElement('div')
    const listButton = document.createElement('a')
    if (started.includes(element.id.toString())) { listButton.className = 'started' }
    if (finished.includes(element.id.toString())) { listButton.className = 'finished' }
    listButton.onclick = function () {
      window.location.href = 'lesson.html#' + element.id
    }
    listButton.innerHTML = element.name
    li.appendChild(listButton)
    ol.appendChild(li)
  })
}
loadLessons()
