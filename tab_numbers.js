const browser = window.browser || window.chrome

var update = function(tab) {
  var original_title = ""
  var i = tab.title.indexOf(' ')
  if (i == -1)
    original_title = tab.title
  else
      if (!isNaN(tab.title.substring(0,i)))
        original_title = tab.title.substr(i+1)
      else
        original_title = tab.title
  browser.tabs.executeScript(
    tab.id,
    {
      code : `document.title = ${JSON.stringify(String(tab.index + 1) + ' ' + original_title)}`
    }
  )
}

function updateAll() {
  browser.tabs.query({}, function(tabs) {
    tabs.forEach(update)
  })
}

function handleMoved(tabId, moveInfo) {
  updateAll()
}

browser.tabs.onMoved.addListener(updateAll)
browser.tabs.onRemoved.addListener(() => {
  updateAll()
  setTimeout(updateAll, 100)
})
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  updateAll()
})

updateAll()
