function quizContent () {
  let Store = require('electron-store')
  let store = new Store()

  // Get Section information
  const SECTION_FILE = './data/sections.json'
  const fs = require('fs')
  const SECTION_DATA = JSON.parse(fs.readFileSync(SECTION_FILE))

  // Get quiz/exam number and set title
  var examID = window.location.hash.substring(1)
  let isQuiz = examID.includes('Q') // Test if this is a quiz
  let title = document.getElementById('examTitle')
  if (isQuiz) {
    examID = examID.substring(1)
    title.innerHTML = 'Lesson ' + examID + ' Quiz'
  } else {
    title.innerHTML = 'Exam ' + examID
  }

  let questionsContent = document.getElementById('questions')

  if (isQuiz) {
    // Get Questions from examID.json
    const questionFile = './data/questions/' + examID + '.json'
    const questionData = JSON.parse(fs.readFileSync(questionFile))
    console.log(questionData)
    questionData.forEach(function (question) {
      var box = document.createElement('div')
      box.className = 'question-box'

      var text = document.createElement('div')
      text.innerHTML = question.text
      text.className = 'question-text'
      box.append(text)

      question.answers.forEach(function (answer) {
        var answerDiv = document.createElement('div')
        answerDiv.addEventListener('click', function () {
          this.className = this.className + ' chosen'
        })
        answerDiv.className = 'question-answer'
        answerDiv.innerHTML = answer
        box.append(answerDiv)
      })

      questionsContent.append(box)
    })
  } else {
    // Get questions from lessons specified in sections.json
    // This line is a bit sketch, we should have better way of getting the element of array
    var lessonsCovered = SECTION_DATA.sections[examID - 1].lessons
    document.getElementById('lessonsCovered').innerHTML = 'Lessons Covered: ' + lessonsCovered
    questionsContent.innerHTML = 'Working on exams...'
  }

  document.getElementById('finishExam').addEventListener('click', function () {
    var finished = store.get('examsFinished')
    if (!Array.isArray(finished) || !finished.length) { finished = [] }
    if (!finished.includes(examID.toString())) {
      finished.push(examID)
    }
    store.set('examsFinished', finished)
    window.location.href = 'index.html'
  })

  document.getElementById('answerChoice').addEventListener('click', function () {
    this.className = this.className + ' chosen'
  })
}
quizContent()
