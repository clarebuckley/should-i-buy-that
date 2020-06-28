window.onload = function () {
    setPreviousSave()
    document.getElementById("saveBtn").addEventListener('click', saveHandler);
    document.getElementById("close").addEventListener('click', closeHandler);
}

function saveHandler() {
    let name = document.getElementById("name").value,
        salary = document.getElementById("salary").value,
        hoursPerDay = document.getElementById("hoursPerDay").value,
        daysPerWeek = document.getElementById("daysPerWeek").value;

    if (name === '' || salary === '' || hoursPerDay === '' || daysPerWeek === '') {
        alert("The extension won't work properly if any of these values aren't entered!")
    } else {
        chrome.storage.sync.set(
            {
                userInput: {
                    name: document.getElementById("name").value,
                    salary: document.getElementById("salary").value,
                    hoursPerDay: document.getElementById("hoursPerDay").value,
                    daysPerWeek: document.getElementById("daysPerWeek").value
                }
            }, function () {
                document.getElementById("success").classList.remove("hidden");
            }
        )
    }
}

function closeHandler() {
    document.getElementById("success").classList.add("hidden");
}

function setPreviousSave() {
    chrome.storage.sync.get('userInput', function (data) {
        if (Object.keys(data.userInput).length > 1) {
            document.getElementById("name").value = data.userInput.name
            document.getElementById("salary").value = data.userInput.salary
            document.getElementById("hoursPerDay").value = data.userInput.hoursPerDay
            document.getElementById("daysPerWeek").value = data.userInput.daysPerWeek
        }
    });

}



