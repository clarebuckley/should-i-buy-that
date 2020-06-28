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
            {
                code: '(' + function () {
                    let totalPrice;
                    matches = document.querySelectorAll("span.order-summary__value--total, .order__summary-total-price--inc-delivery, .grand-total-price, .sc-price, .hlb-price, .total-row > span > span > span, .summary-item > tbody > tr:last-child > .amount > span > span, .bag-total-price--subtotal, .cart-payment-section > table > tbody:last-child > tr:last-child > td > h1 > .money > .currency-value")
                    matchesArray = Array.from(matches);
                    //this is bad, so far only ebay uses length ==2
                    if (matchesArray.length == 1) {
                        totalPrice = matchesArray[0].innerText;
                    }
                    else if (matchesArray.length == 2) {
                        totalPrice = matchesArray[1].innerText;
                    } 
                    
                    return {
                        totalPrice: totalPrice
                    };
                } + ')()'
            },
            function (data) {
                if (Object.keys(data[0]).length === 0) {
                    costIsNotAvailable();
                } else {
                    costIsAvailable();
                    displaySummary(data[0].totalPrice);
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

    totalCost = totalCost.replace(/\u00A3/g,"")

    totalCostElem.innerHTML = totalCost;
    costInHoursElem.innerHTML = (totalCost / getHourlyRate()).toFixed(2)
    costInDaysElem.innerHTML = (totalCost / getDailyRate()).toFixed(2)
    costInWeeksElem.innerHTML = (totalCost / getWeeklyRate()).toFixed(2)
}

function getHourlyRate() {
    salary = salary.toString().replace(",", "")
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