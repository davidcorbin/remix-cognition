const LESSON_FILE = './data/lessons/lessons.json'
const SECTIONS_FILE = './data/sections.json'
const EXAMS_FILE = './data/exams.json'

function getLessons () {
  const fs = require('fs')
  let rawdata = fs.readFileSync(LESSON_FILE)
  return JSON.parse(rawdata)
}

function getSections () {
  const fs = require('fs')
  let rawdata = fs.readFileSync(SECTIONS_FILE)
  return JSON.parse(rawdata)
}

function getExams () {
  const fs = require('fs')
  let rawdata = fs.readFileSync(EXAMS_FILE)
  return JSON.parse(rawdata)
}

function getConnectorElement () {
  const connector = document.createElement('div')
  connector.className = 'sidebar-connector'
  return connector
}

function getConnectorSpacerInSectionElement () {
  const spacer = document.createElement('div')
  spacer.className = 'sidebar-connector-spacer-in-section'
  return spacer
}

function getConnectorSpacerBetweenSectionElement () {
  const spacer = document.createElement('div')
  spacer.className = 'sidebar-connector-spacer-between-section'
  return spacer
}

function loadLessons () {
  let Store = require('electron-store')
  let store = new Store()

  var started = store.get('started')
  if (!Array.isArray(started) || !started.length) { started = [] }
  var finished = store.get('finished')
  if (!Array.isArray(finished) || !finished.length) { finished = [] }
  let allLessons = getLessons()
  let allSections = getSections()
  let allExams = getExams()

  const sidebarConnectors = document.getElementById('sidebar-connectors')
  const content = document.getElementById('lessons')

  // For each lesson in the sidebar
  allLessons.forEach(function (lesson, i) {
    // For each section in the section list
    allSections.sections.forEach(function (section, j) {
      if (section.lessons.includes(i + 1)) {
        // Create connector
        const connector = getConnectorElement()
        sidebarConnectors.append(connector)
        const spacer = getConnectorSpacerInSectionElement()
        sidebarConnectors.append(spacer)
      }
    })

    const lessonDiv = document.createElement('div')
    const lessonButton = document.createElement('a')

    // Set class based on whether the lesson is started or finished
    if (started.includes(lesson.id.toString())) { lessonButton.className = 'started' }
    if (finished.includes(lesson.id.toString())) { lessonButton.className = 'finished' }

    // Set hyperlink
    lessonButton.onclick = function () {
      window.location.href = 'lesson.html#' + lesson.id
    }

    lessonButton.innerHTML = lesson.name
    lessonDiv.appendChild(lessonButton)
    content.appendChild(lessonDiv)

    // Add the appropriate exams after the lesson
    allExams.exams.forEach(function (exam) {
      // Check the last ID to determine placement
      if (exam.ids[exam.ids.length - 1] === i + 1) {
        allSections.sections.forEach(function (section, j) {
          if (section.lessons.includes(i + 1)) {
            // Create connector
            const connector = getConnectorElement()
            sidebarConnectors.append(connector)

            if (section.lessons[section.lessons.length - 1] === i + 1) {
              // Create connector spacer
              const spacer = getConnectorSpacerBetweenSectionElement()
              sidebarConnectors.append(spacer)
            } else {
              const spacer = getConnectorSpacerInSectionElement()
              sidebarConnectors.append(spacer)
            }
          }
        })
        const examDiv = document.createElement('div')
        const examButton = document.createElement('a')
        // Set hyperlink
        examButton.onclick = function () {
          window.alert('clicked')
          window.location.href = 'exam.html#' + exam.ids
        }
        examButton.className = 'started'
        examButton.innerHTML = exam.name
        examDiv.appendChild(examButton)
        content.appendChild(examDiv)
      }
    })
  })
}

loadLessons()
