
window.onload = function () {
    document.getElementById("setUpOptions").addEventListener('click', setUpOptions);
    renderPopup();
}

function setUpOptions() {
    chrome.tabs.create({ url: "../html/options.html" });
}

function renderPopup() {
    chrome.storage.sync.get('userInput', function (data) {
        let userInput = data.userInput;

        setInitialDisplay(userInput);
        displayGreeting(userInput.name);
        getTotalPriceFromDOM().then((totalPrice) => {
            if (totalPrice != -1) {
                showCostSummary();
                displaySummary(totalPrice, userInput);
            } else {
                hideCostSummary();
            }
        })
    })
}

//Check that the user has added their details - if not, display instructions to set these
function setInitialDisplay(userInput) {
    if (typeof userInput === 'undefined' || userInput.salary == "" || userInput.hoursPerDay == "" || userInput.daysPerWeek == "") {
        document.getElementById("noOptions").classList.remove("hidden");
        document.getElementById("main").classList.add("hidden");
    } else {
        document.getElementById("noOptions").classList.add("hidden");
        document.getElementById("main").classList.remove("hidden");
    }
}

function displayGreeting(name) {
    let greeting = document.getElementById('greeting');
    greeting.innerHTML = "Hi, " + name + "!";
}

async function getTotalPriceFromDOM() {
    return new Promise((resolve, reject) => {
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
                        return resolve(-1);
                    } else {
                        return resolve(data[0].totalPrice.replace(/\u00A3/g, ""))
                    }
                }
            );
        });
    })
}

//Get the summary information to be displayed
function displaySummary(totalCost, userInput) {
    let totalCostElem = document.getElementById('totalCost');
    let costInHoursElem = document.getElementById('costInHours');
    let costInDaysElem = document.getElementById('costInDays');
    let costInWeeksElem = document.getElementById('costInWeeks');

    totalCostElem.innerHTML = totalCost;
    console.log(totalCost, userInput.salary, userInput.hoursPerDay, userInput.daysPerWeek)
    costInHoursElem.innerHTML = getCostInHours(totalCost, userInput.salary, userInput.hoursPerDay, userInput.daysPerWeek);
    costInDaysElem.innerHTML = getCostInDays(totalCost, userInput.salary, userInput.hoursPerDay, userInput.daysPerWeek);
    costInWeeksElem.innerHTML = getCostInWeeks(totalCost, userInput.salary, userInput.hoursPerDay, userInput.daysPerWeek);
}


//------------------------------------Get rates based on salary------------------------------------
function getHourlyRate(salary, hoursPerDay, daysPerWeek) {
    salary = parseFloat(salary)
    hoursPerDay = parseFloat(hoursPerDay)
    return (salary / 52) / (hoursPerDay * daysPerWeek)
}

function getDailyRate(salary, hoursPerDay, daysPerWeek) {
    hoursPerDay = parseFloat(hoursPerDay)
    return getHourlyRate(salary, hoursPerDay, daysPerWeek) * hoursPerDay
}

function getWeeklyRate(salary, hoursPerDay, daysPerWeek) {
    daysPerWeek = parseFloat(daysPerWeek)
    return getDailyRate(salary, hoursPerDay, daysPerWeek) * daysPerWeek
}

//------------------------------------Get cost of total items based on rates------------------------------------
function getCostInHours(totalCost, salary, hoursPerDay, daysPerWeek) {
    return (totalCost / getHourlyRate(salary, hoursPerDay, daysPerWeek)).toFixed(2)
}

function getCostInDays(totalCost, salary, hoursPerDay, daysPerWeek) {
    return (totalCost / getDailyRate(salary, hoursPerDay, daysPerWeek)).toFixed(2)
}

function getCostInWeeks(totalCost, salary, hoursPerDay, daysPerWeek) {
    return (totalCost / getWeeklyRate(salary, hoursPerDay, daysPerWeek)).toFixed(2)
}


//------------------------------------Decide which view to display------------------------------------
function showCostSummary() {
    document.getElementById("costSummary").classList.remove("hidden");
    document.getElementById("costUnavailable").classList.add("hidden");
}

function hideCostSummary() {
    document.getElementById("costSummary").classList.add("hidden");
    document.getElementById("costUnavailable").classList.remove("hidden");
}



module.exports = {getHourlyRate, getDailyRate, getWeeklyRate, getCostInHours, getCostInDays, getCostInWeeks}