this.onload = function () {
  const fs = require('fs')
  let rawdata = fs.readFileSync('./data/lessons/lessons.json')
  let allLessons = JSON.parse(rawdata)
  const ol = document.getElementById('lessons')
  allLessons.forEach(function (element) {
    const li = document.createElement('li')
    const listButton = document.createElement('button')
    listButton.onclick = function () {
      window.location.href = 'lesson.html' + '#' + element.name
    }
    listButton.innerHTML = element.name
    li.appendChild(listButton)
    ol.appendChild(li)
  })
}
