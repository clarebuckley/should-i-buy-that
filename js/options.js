window.onload = function () {
    setPreviousSave()
    document.getElementById("saveBtn").addEventListener('click', saveHandler);
    document.getElementById("closeSuccess").addEventListener('click', closeHandler);
    document.getElementById("closeFail").addEventListener('click', closeHandler);
}

function saveHandler() {
    let name = document.getElementById("name").value,
        salary = document.getElementById("salary").value,
        hoursPerDay = document.getElementById("hoursPerDay").value,
        daysPerWeek = document.getElementById("daysPerWeek").value;

    document.getElementById("success").classList.add("hidden");
    document.getElementById("fail").classList.add("hidden");

    if (name === '' || salary === '' || hoursPerDay === '' || daysPerWeek === '') {
        alert("The extension won't work properly if any of these values aren't entered!")
        document.getElementById("fail").classList.remove("hidden");
    } else {
        salary = salary.replace(",", "");

        chrome.storage.sync.set(
            {
                userInput: {
                    name: name,
                    salary: salary,
                    hoursPerDay: hoursPerDay,
                    daysPerWeek: daysPerWeek
                }
            }, function () {
                document.getElementById("success").classList.remove("hidden");
            }
        )
    }
}

function closeHandler() {
    document.getElementById("success").classList.add("hidden");
    document.getElementById("fail").classList.add("hidden");
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



