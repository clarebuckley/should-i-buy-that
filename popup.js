let salary, hoursPerDay, daysPerWeek;

window.onload = function () {
    setInitialDisplay();
    displayGreeting();
    renderPopup()
}

//Check that the user has added their details - if not, display instructions to set these
function setInitialDisplay() {
    chrome.storage.sync.get('userInput', function (data) {
        if (typeof data.userInput === 'undefined') {
            document.getElementById("noOptions").classList.remove("hidden");
            document.getElementById("main").classList.add("hidden");
        } else {
            document.getElementById("noOptions").classList.add("hidden");
            document.getElementById("main").classList.remove("hidden");

            console.log(data.userInput)
            salary = data.userInput.salary;
            hoursPerDay = data.userInput.hoursPerDay;
            daysPerWeek = data.userInput.daysPerWeek;

        }
    })
}


function displayGreeting() {
    let greeting = document.getElementById('greeting');
    chrome.storage.sync.get('userInput', function (data) {
        greeting.innerHTML = "Hi, " + data.userInput.name + "!";
    });
}

async function renderPopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'document.querySelector(".order-summary__value--total").textContent' },
            function (matches) {
                if (matches[0] == null) {
                    costIsNotAvailable();
                } else {
                    costIsAvailable();
                    displaySummary(matches[0]);
                }
            }
        );
    });
}

function displaySummary(totalCost) {
    let totalCostElem = document.getElementById('totalCost');
    let costInHoursElem = document.getElementById('costInHours');
    let costInDaysElem = document.getElementById('costInDays');
    let costInWeeksElem = document.getElementById('costInWeeks');

    totalCost = totalCost.substring(1)
    totalCostElem.innerHTML = totalCost;
    costInHoursElem.innerHTML = (totalCost / getHourlyRate()).toFixed(2)
    costInDaysElem.innerHTML = (totalCost / getDailyRate()).toFixed(2)
    costInWeeksElem.innerHTML = (totalCost / getWeeklyRate()).toFixed(2)
}

function getHourlyRate() {
    salary = parseFloat(salary)
    hoursPerDay = parseFloat(hoursPerDay)
    return (salary / 52) / (hoursPerDay * daysPerWeek)
}

function getDailyRate() {
    hoursPerDay = parseFloat(hoursPerDay)
    return getHourlyRate() * hoursPerDay
}

function getWeeklyRate() {
    daysPerWeek = parseFloat(daysPerWeek)
    return getDailyRate() * daysPerWeek
}



function costIsAvailable() {
    document.getElementById("costSummary").classList.remove("hidden");
    document.getElementById("costUnavailable").classList.add("hidden");
}

function costIsNotAvailable() {
    document.getElementById("costSummary").classList.add("hidden");
    document.getElementById("costUnavailable").classList.remove("hidden");
}