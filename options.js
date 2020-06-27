window.onload = function () {
    setPreviousSave()
    document.getElementById("saveBtn").addEventListener('click', saveHandler)
}

function saveHandler() {
    chrome.storage.sync.set(
        {
            userInput: {
                name: document.getElementById("name").value,
                salary: document.getElementById("salary").value,
                hoursPerDay: document.getElementById("hoursPerDay").value,
                daysPerWeek: document.getElementById("daysPerWeek").value
            }
        }
    )
}

function setPreviousSave() {
    chrome.storage.sync.get('name', function (data) {
        document.getElementById("name").value = data.name
    });
    chrome.storage.sync.get('salary', function (data) {
        document.getElementById("salary").value = data.salary
    });
    chrome.storage.sync.get('hoursPerDay', function (data) {
        document.getElementById("hoursPerDay").value = data.hoursPerDay
    });
    chrome.storage.sync.get('daysPerWeek', function (data) {
        document.getElementById("daysPerWeek").value = data.daysPerWeek
    });
}



