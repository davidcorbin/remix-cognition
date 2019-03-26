const fs = require('fs')
const DataFile = require('./js/DataFile.js')
const df = new DataFile()

const LESSON_FILE = df.getLessonFile()
const SECTIONS_FILE = df.getSectionsFile()

function getLessons () {
  let rawdata = fs.readFileSync(LESSON_FILE)
  return JSON.parse(rawdata)
}

function getSections () {
  let rawdata = fs.readFileSync(SECTIONS_FILE)
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

  var lessonsStarted = store.get('started')
  if (!Array.isArray(lessonsStarted) || !lessonsStarted.length) { lessonsStarted = [] }
  var lessonsFinished = store.get('finished')
  if (!Array.isArray(lessonsFinished) || !lessonsFinished.length) { lessonsFinished = [] }
  var examObj = (store.get('exams'))
  var exams
  if (examObj) {
    exams = Object.keys(examObj)
  } else {
    exams = []
  }
  let allLessons = getLessons()
  let allSections = getSections()

  const sidebarConnectors = document.getElementById('sidebar-connectors')
  const content = document.getElementById('lessons')

  // For each lesson in the sidebar
  allLessons.forEach(function (lesson, i) {
    // ADDING LESSONS
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
    if (lessonsStarted.includes(lesson.id.toString())) { lessonButton.className = 'started' }
    if (lessonsFinished.includes(lesson.id.toString())) { lessonButton.className = 'finished' }

    // Set hyperlink
    lessonButton.onclick = function () {
      window.location.href = 'lesson.html#' + lesson.id
    }

    lessonButton.innerHTML = lesson.name
    lessonDiv.appendChild(lessonButton)
    content.appendChild(lessonDiv)

    // ADDING EXAMS
    // Add the appropriate exams after the lesson
    allSections.sections.forEach(function (section) {
      // Check the last ID to determine placement
      if (section.lessons[section.lessons.length - 1] === i + 1) {
        allSections.sections.forEach(function (section, j) {
          if (section.lessons.includes(i + 1)) {
            // Create connector
            const connector = getConnectorElement()
            sidebarConnectors.append(connector)
            // Create connector spacer
            const spacer = getConnectorSpacerBetweenSectionElement()
            sidebarConnectors.append(spacer)
          }
        })
        const examDiv = document.createElement('div')
        const examButton = document.createElement('a')
        // Set hyperlink
        examButton.onclick = function () {
          window.location.href = 'exam.html#' + section.id
        }
        if (exams.includes(section.id.toString())) {
          examButton.className = 'finished'
        }
        examButton.innerHTML = 'Exam ' + section.id
        examDiv.appendChild(examButton)
        content.appendChild(examDiv)
      }
    })
  })
}
loadLessons()
