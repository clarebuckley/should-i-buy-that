window.onload = function () {
    setPreviousSave();
    document.getElementById("saveBtn").addEventListener('click', saveHandler);
    document.getElementById("closeSuccess").addEventListener('click', closeHandler);
    document.getElementById("closeFail").addEventListener('click', closeHandler);
    document.getElementById("typeOfPaySelection").addEventListener('change', changeTypeOfPayHandler);
}

function saveHandler() {
    let name = document.getElementById("name").value,
        salary = document.getElementById("salary").value,
        hoursPerDay = document.getElementById("hoursPerDay").value,
        daysPerWeek = document.getElementById("daysPerWeek").value,
        paySelection = document.getElementById("typeOfPaySelection").value;
    
    hide("success");
    hide("fail");

    if (name === '' || salary === '' || hoursPerDay === '' || daysPerWeek === '') {
        alert("The extension won't work properly if any of these values aren't entered!")
        show("fail");
    } else {
        salary = salary.replace(",", "");
        chrome.storage.sync.set(
            {
                userInput: {
                    name: name,
                    salary: salary,
                    hoursPerDay: hoursPerDay,
                    daysPerWeek: daysPerWeek,
                    paySelection: paySelection
                }
            }, function () {
                show("success");
            }
        )
    }
}

function closeHandler() {
    hide("success");
    hide("fail");
}

function setPreviousSave() {
    chrome.storage.sync.get('userInput', function (data) {
        if (Object.keys(data.userInput).length > 1) {
            document.getElementById("name").value = data.userInput.name
            document.getElementById("salary").value = data.userInput.salary
            document.getElementById("hoursPerDay").value = data.userInput.hoursPerDay
            document.getElementById("daysPerWeek").value = data.userInput.daysPerWeek
            document.getElementById("typeOfPaySelection").value = data.userInput.paySelection
        }
    });
}

function changeTypeOfPayHandler() {
    var value = document.getElementById("typeOfPaySelection").value;
    switch (value) {
        case "Yearly":
            show("annualPayLabel");
            hide("monthlyPayLabel");
            hide("weeklyPayLabel");
            hide("dailyPayLabel");
            break;
        case "Monthly":
            hide("annualPayLabel");
            show("monthlyPayLabel");
            hide("weeklyPayLabel");
            hide("dailyPayLabel");
            break;
        case "Weekly":
            hide("annualPayLabel");
            hide("monthlyPayLabel");
            show("weeklyPayLabel");
            hide("dailyPayLabel");
            break;
        case "Daily":
            hide("annualPayLabel");
            hide("monthlyPayLabel");
            hide("weeklyPayLabel");
            show("dailyPayLabel");
            break;
        default:
            console.error("Invalid selection");
    }
}

function hide(elementId) {
    document.getElementById(elementId).classList.add("hidden");
}

function show(elementId) {
    console.log(elementId)
    document.getElementById(elementId).classList.remove("hidden");
}

