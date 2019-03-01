function loadLessons () {
  const fs = require('fs')
  let rawdata = fs.readFileSync('./data/lessons/lessons.json')
  let allLessons = JSON.parse(rawdata)
  const ul = document.querySelector('ul')
  allLessons.forEach(function (element) {
    const li = document.createElement('button')
    const itemText = document.createTextNode(element.name)
    li.appendChild(itemText)
    ul.appendChild(li)
  })
}
