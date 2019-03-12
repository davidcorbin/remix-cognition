function loadProgress () {
  let Chart = require('./node_modules/chart.js/src/chart')
  let Store = require('electron-store')
  let store = new Store()

  const progDiv = document.getElementById('progress')
  var sDiv = document.createElement('div')
  var fDiv = document.createElement('div')
  var uDiv = document.createElement('div')
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
  const unNum = 25 - stNum - fiNum
  sDiv.innerHTML = 'started: ' + stNum
  progDiv.appendChild(sDiv)
  fDiv.innerHTML = 'finished: ' + fiNum
  progDiv.appendChild(fDiv)
  uDiv.innerHTML = 'unstarted: ' + unNum
  progDiv.appendChild(uDiv)

  document.getElementById('set').addEventListener('click', function () {
    store.set('started', 0)
    store.set('finished', 0)
    store.set('unstarted', 0)
    window.location.reload()
  })

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
}
loadProgress()
