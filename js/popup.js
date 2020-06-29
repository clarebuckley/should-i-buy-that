let salary, hoursPerDay, daysPerWeek;

window.onload = function () {
    document.getElementById("setUpOptions").addEventListener('click', setUpOptions);
    setInitialDisplay();
    displayGreeting();
    renderPopup()
}

function setUpOptions() {
    chrome.tabs.create({ url: "options.html" });
}

//Check that the user has added their details - if not, display instructions to set these
function setInitialDisplay() {
    chrome.storage.sync.get('userInput', function (data) {
        if (typeof data.userInput === 'undefined' || data.userInput.salary == "" || data.userInput.hoursPerDay == "" || data.userInput.daysPerWeek == "") {
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

//Get contents to display on popup
async function renderPopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: '(' + function () {
                    let totalPrice;
                    matches = document.querySelectorAll("span.order-summary__value--total, .order__summary-total-price--inc-delivery, .grand-total-price, #sc-subtotal-amount-buybox > .sc-price, .hlb-price, .total-row > span > span > span, .summary-item > tbody > tr:last-child > .amount > span > span, .bag-total-price--subtotal, .cart-payment-section > table > tbody:last-child > tr:last-child > td > h1 > .money > .currency-value")
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

//Get the summary information to be displayed
function displaySummary(totalCost) {
    let totalCostElem = document.getElementById('totalCost');
    let costInHoursElem = document.getElementById('costInHours');
    let costInDaysElem = document.getElementById('costInDays');
    let costInWeeksElem = document.getElementById('costInWeeks');

    totalCost = totalCost.replace(/\u00A3/g,"")

    totalCostElem.innerHTML = totalCost;
    costInHoursElem.innerHTML = getCostInHours(totalCost);
    costInDaysElem.innerHTML = getCostInDays(totalCost);
    costInWeeksElem.innerHTML = getCostInWeeks(totalCost);
}


//------------------------------------Get rates based on salary------------------------------------
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

//------------------------------------Get cost of total items based on rates------------------------------------
function getCostInHours(totalCost) {
    return (totalCost / getHourlyRate()).toFixed(2)
}

function getCostInDays(totalCost) {
    return (totalCost / getDailyRate()).toFixed(2)
}

function getCostInWeeks(totalCost) {
    return (totalCost / getWeeklyRate()).toFixed(2)
}


//------------------------------------Decide which view to display------------------------------------
function costIsAvailable() {
    document.getElementById("costSummary").classList.remove("hidden");
    document.getElementById("costUnavailable").classList.add("hidden");
}

function costIsNotAvailable() {
    document.getElementById("costSummary").classList.add("hidden");
    document.getElementById("costUnavailable").classList.remove("hidden");
}