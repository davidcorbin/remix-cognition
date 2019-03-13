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

  // When click 'Set User' link
  document.getElementById('set').addEventListener('click', function () {
    store.set('started', 0)
    store.set('finished', 0)
    store.set('unstarted', 0)
    store.set('examsFinished', 0)
    window.location.reload()
  })

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

  // Add bar chart
  // var ctx = document.getElementById('quizChart').getContext('2d')
}
loadProgress()
