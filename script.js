import flatpickr from 'flatpickr'

const destEl = document.querySelector('#dest-element')
const timeRangesWrapper = document.querySelector('#time-ranges')
const ranges = ['10-12', '12-14', '14-16', '16-18', '18-20', '20-22']

let currentData = JSON.parse(destEl.value)

const render = data => {
  timeRangesWrapper.innerHTML = ''

  data = data.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date)
  })

  data.forEach(item => {
    const newEl = document.createElement('div')

    const label = document.createElement('p')
    label.classList.add('date')
    label.textContent = `Временные слоты для ${item.date}`

    const checkboxesWrapper = document.createElement('div')
    checkboxesWrapper.classList.add('checkboxes')

    ranges.forEach(range => {
      const rangeLabel = document.createElement('label')
      rangeLabel.textContent = range

      const rangeInput = document.createElement('input')
      rangeInput.type = 'checkbox'
      rangeInput.value = range
      rangeInput.checked = item.times.includes(range)

      rangeInput.addEventListener('change', e => {
        if (e.target.checked) {
          item.times = [...item.times, range]
        } else {
          item.times = item.times.filter(time => time !== range)
        }

        updateValue(data)
      })
      rangeLabel.appendChild(rangeInput)
      checkboxesWrapper.appendChild(rangeLabel)
    })

    newEl.appendChild(label)
    newEl.appendChild(checkboxesWrapper)

    timeRangesWrapper.appendChild(newEl)
  })

  updateValue(data)
}

const updateValue = data => {
  destEl.value = JSON.stringify(data)
}

const calendar = flatpickr('#datepicker', {
  mode: 'multiple',
  dateFormat: 'Y-m-d',
  defaultDate: currentData.map(item => item.date),
  onChange: function(_, dateStr) {
    render(currentData)
    const previousDates = currentData
    const selectedDates = dateStr.split(', ')
    const alreadySelectedDates = previousDates.map(item => item.date)

    currentData = selectedDates.map(item => {
      if (alreadySelectedDates.includes(item)) {
        return previousDates.find(date => date.date === item)
      }
      return {
        date: item,
        times: []
      }
    })

    render(currentData)
    updateValue(currentData)
  }
})

render(currentData)

document.querySelector('#manual-button').addEventListener('click', e => {
  e.preventDefault()
  calendar.open()
})
