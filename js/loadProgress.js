function loadProgress () {
  let Chart = require('chart.js/src/chart')
  let Store = require('electron-store')
  let store = new Store()

  // Get total number of lessons, to show on pie chart
  const LESSON_FILE = './data/lessons/lessons.json'
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
  var quizzes = store.get('quizzes')
  var labels = []
  var data = []
  var backgroundColor = []
  for (var q in quizzes) {
    var quiz = quizzes[q]
    labels.push('Quiz ' + q)
    var percent = Math.floor(100 * quiz.numCorrect / quiz.numQuestions)
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
}
loadProgress()
