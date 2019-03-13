function quizContent () {
  let Store = require('electron-store')
  let store = new Store()

  // Get Section information
  const SECTION_FILE = './data/sections.json'
  const fs = require('fs')
  const SECTION_DATA = JSON.parse(fs.readFileSync(SECTION_FILE))

  var questionFile, questionData, questionShuffled
  var examDone = false

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
    // Set button to go to lesson
    document.getElementById('gotoLesson').addEventListener('click', function () {
      window.location = './lesson.html#' + examID
    })

    // TODO: Put lesson title on top

    // TODO: Check if quiz already taken

    // Get Questions from examID.json
    questionFile = './data/questions/' + examID + '.json'
    questionData = JSON.parse(fs.readFileSync(questionFile))
    questionShuffled = JSON.parse(fs.readFileSync(questionFile))
    questionShuffled.forEach(function (question) {
      console.log(question.answers[0])
      question.answers = shuffle(question.answers)
      var box = document.createElement('div')
      box.className = 'question-box'

      var text = document.createElement('div')
      text.innerHTML = question.text
      text.className = 'question-text'
      box.append(text)

      question.answers.forEach(function (answer) {
        var answerDiv = document.createElement('div')
        answerDiv.addEventListener('click', function () {
          if (examDone) {
            return
          }
          if (this.className.includes('chosen') || this.className.includes('disabled')) {
            // If clicked other answer, change answer
            this.parentElement.childNodes.forEach(function (sibling) {
              sibling.className = sibling.className.replace(' chosen', '')
              sibling.className = sibling.className.replace(' disabled', '')
            })
          }
          this.className = this.className + ' chosen'
          this.parentElement.childNodes.forEach(function (sibling) {
            if (!sibling.className.includes('chosen')) {
              sibling.className += ' disabled'
            }
          })
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
    console.log(lessonsCovered)
    document.getElementById('lessonsCovered').innerHTML = 'Lessons Covered: ' + lessonsCovered
    questionsContent.innerHTML = 'Working on exams...'
  }

  document.getElementById('finishExam').addEventListener('click', function () {
    // Get chosen answers into an array
    const chosenDivs = document.getElementsByClassName('chosen')
    var chosenAnswers = []
    for (var div of chosenDivs) {
      chosenAnswers.push(div.innerHTML)
    }
    console.log(chosenAnswers)

    // Get question boxes
    const questionBoxes = document.getElementsByClassName('question-box')

    // Check for every answer
    var errorDisp = document.getElementById('errorDisp')
    if (chosenAnswers.length !== questionBoxes.length) {
      errorDisp.innerHTML = 'Answer ' + (questionBoxes.length - chosenAnswers.length) + ' more question(s) first.'
      return
    } else {
      errorDisp.innerHTML = ''
    }

    // Set variable so cant click answers anymore
    examDone = true
    // Hide button
    this.className += ' hidden'

    // Data to be stored
    var correctResponse = []
    var correctNum = 0

    // Go through each answer
    for (var i = 0; i < chosenAnswers.length; i++) {
      // Get the right answer
      var answer = chosenAnswers[i]
      var correct = questionData[i].answers[0]
      var question = questionBoxes.item(i)

      // Check if each answer is right
      var applyClass = 'incorrect'
      if (answer === correct) {
        correctNum++
        applyClass = 'correct'
        correctResponse.push(true)
      } else {
        applyClass = 'incorrect'
        correctResponse.push(false)
        question.childNodes.forEach(function (answer) {
          if (answer.innerHTML === correct) {
            answer.className = answer.className.replace(' disabled', '')
            answer.className += ' correct'
          }
        })
      }
      question.childNodes.forEach(function (answer) {
        if (answer.className.includes('chosen')) {
          answer.className = answer.className.replace(' chosen', '')
          answer.className += ' ' + applyClass
        }
      })
    }
    console.log(correctNum)
    // Store results
    var result = {}
    result['correctAnswers'] = correctResponse
    result['numCorrect'] = correctNum
    result['numQuestions'] = chosenAnswers.length
    store.set('quizzes.' + examID, result)

    // Display Result
    var resultDiv = document.getElementById('results')
    resultDiv.innerHTML = correctNum + '/' + chosenAnswers.length +
      ': ' + Math.floor(100 * correctNum / chosenAnswers.length) + '%'
    var homeButton = document.getElementById('goHome')
    homeButton.className = homeButton.className.replace(' hidden', '')

    // var finished = store.get('examsFinished')
    // if (!Array.isArray(finished) || !finished.length) { finished = [] }
    // if (!finished.includes(examID.toString())) {
    //   finished.push(examID)
    // }
    // store.set('examsFinished', finished)
    // window.location.href = 'index.html'
  })
}
// Fisher-Yates Shuffle
function shuffle (array) {
  var currentIndex = array.length; var temporaryValue; var randomIndex
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}
quizContent()
