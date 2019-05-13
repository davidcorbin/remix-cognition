function loadProgress () {
  let Chart = require('chart.js/dist/Chart')
  let Store = require('electron-store')
  let store = new Store()

  const DataFile = require('./js/DataFile.js')
  const df = new DataFile()

  // Get total number of lessons, to show on pie chart
  const LESSON_FILE = df.getLessonFile()
  const fs = require('fs')
  const LESSON_DATA = JSON.parse(fs.readFileSync(LESSON_FILE))
  const totalLessons = Object.keys(LESSON_DATA).length

  // Get num of lessons started and finished from store
  var fiArr = store.get('finished')
  if (!Array.isArray(fiArr) || !fiArr.length) {
    fiArr = []
  }
  const fiNum = fiArr.length
  var viArr = store.get('started')
  if (!Array.isArray(viArr) || !viArr.length) {
    viArr = []
  }
  const stNum = viArr.length
  const unNum = totalLessons - stNum - fiNum

  // Put lessons left on screen
  var lessonsLeftDiv = document.getElementById('unstartedLessons')
  lessonsLeftDiv.innerHTML = unNum

  // Add pie chart
  var ctx = document.getElementById('progChart').getContext('2d')
  var progChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Unstarted', 'Started', 'Finished'],
      datasets: [{
        data: [
          unNum,
          stNum,
          fiNum
        ],
        backgroundColor: [
          '#1C2035',
          '#373979',
          '#5F6BD1'
        ],
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        position: 'bottom',
        labels: {
          fontColor: '#EAEAEA',
          boxWidth: 12
        }
      }
    }
  })
  progChart.update()

  // Get quiz data for chart
  var grade = 0
  var numQuizzes = 0
  var quizzes = store.get('quizzes')
  var labels = []
  var data = []
  var backgroundColor = []
  for (var q in quizzes) {
    var quiz = quizzes[q]
    labels.push('Quiz ' + q)
    var percent = Math.floor(100 * quiz.numCorrect / quiz.numQuestions)
    grade += percent
    numQuizzes++
    console.log(quiz.numCorrect)
    data.push(percent)
    if (percent > 85) {
      backgroundColor.push('#5F6BD1')
    } else if (percent > 75) {
      backgroundColor.push('#373979')
    } else {
      backgroundColor.push('#1C2035')
    }
  }
  // Set the grade to the average of the quizzes
  if (numQuizzes !== 0) {
    grade = grade / numQuizzes
  }
  console.log(labels)
  console.log(data)
  console.log(backgroundColor)
  // Add bar chart
  ctx = document.getElementById('quizChart').getContext('2d')
  var quizChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderWidth: 1
      }]
    },
    options: {
      tooltips: {
        'enabled': false
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: '#1C2035',
            drawBorder: false,
            lineWidth: 2
          },
          ticks: {
            fontColor: '#EAEAEA',
            fontStyle: 'Bold',
            fontSize: '16'
          }
        }],
        xAxes: [{
          gridLines: {
            color: '#1C2035',
            drawBorder: false,
            lineWidth: 2
          },
          ticks: {
            fontColor: '#EAEAEA',
            fontStyle: 'Bold',
            fontSize: '16',
            suggestedMin: 0,
            suggestedMax: 100
          }
        }]
      },
      legend: {
        display: false
      },
      hover: {
        animationDuration: 1
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart

          var ctx = chartInstance.ctx
          ctx.textAlign = 'center'
          ctx.fillStyle = '#EAEAEA'
          ctx.textBaseline = 'bottom'

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i)
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index]
              ctx.fillText(data, bar._model.x - 25, bar._model.y + 9)
            })
          })
        }
      }
    }
  })
  quizChart.update()

  // Get quiz data for chart
  var examGrade = 0
  var numExams = 0
  var exams = store.get('exams')
  labels = []
  data = []
  backgroundColor = []
  for (q in exams) {
    var exam = exams[q]
    labels.push('Exam ' + q)
    percent = Math.floor(100 * exam.numCorrect / exam.numQuestions)
    examGrade += percent
    numExams++
    console.log(exam.numCorrect)
    data.push(percent)
    if (percent > 85) {
      backgroundColor.push('#5F6BD1')
    } else if (percent > 75) {
      backgroundColor.push('#373979')
    } else {
      backgroundColor.push('#1C2035')
    }
  }
  // Calculate total grade with equal weights to total exam and total quiz score
  if (numExams !== 0) {
    examGrade = examGrade / numExams
    // Set grade to be the average of the quiz and exam grades
    grade = (grade + examGrade) / 2
  }
  var gradeElement = document.getElementById('grade')
  gradeElement.innerHTML = grade
  console.log(labels)
  console.log(data)
  console.log(backgroundColor)
  // Add bar chart
  ctx = document.getElementById('examChart').getContext('2d')
  var examChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderWidth: 1
      }]
    },
    options: {
      tooltips: {
        'enabled': false
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: '#1C2035',
            drawBorder: false,
            lineWidth: 2
          },
          ticks: {
            fontColor: '#EAEAEA',
            fontStyle: 'Bold',
            fontSize: '16'
          }
        }],
        xAxes: [{
          gridLines: {
            color: '#1C2035',
            drawBorder: false,
            lineWidth: 2
          },
          ticks: {
            fontColor: '#EAEAEA',
            fontStyle: 'Bold',
            fontSize: '16',
            suggestedMin: 0,
            suggestedMax: 100
          }
        }]
      },
      legend: {
        display: false
      },
      hover: {
        animationDuration: 1
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart

          var ctx = chartInstance.ctx
          ctx.textAlign = 'center'
          ctx.fillStyle = '#EAEAEA'
          ctx.textBaseline = 'bottom'

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i)
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index]
              ctx.fillText(data, bar._model.x - 25, bar._model.y + 9)
            })
          })
        }
      }
    }
  })
  examChart.update()
}
loadProgress()
