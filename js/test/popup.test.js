const popupFunctions = require("../popup.js");
test("Calculating rates", () => {
    expect(popupFunctions.getHourlyRate("20000", 7.5, 5).toFixed(2)).toBe("10.26")
    expect(popupFunctions.getDailyRate(20000, 7.5, 5).toFixed(2)).toBe("76.92")
    expect(popupFunctions.getWeeklyRate(20000, 7.5, 5).toFixed(2)).toBe("384.62")
})

test("Calculating costs", () => {
    expect(popupFunctions.getCostInHours(41.95, "27,000", 7.5, 5)).toBe("0.49")
    expect(popupFunctions.getCostInDays(5,20000,7.5,5)).toBe("0.06")
    expect(popupFunctions.getCostInWeeks(5,20000,7.5,5)).toBe("0.01")
})