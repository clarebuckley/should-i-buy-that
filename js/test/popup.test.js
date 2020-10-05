const {
  getHourlyRate,
  getDailyRate,
  getWeeklyRate,
  getCostInHours,
  getCostInDays,
  getCostInWeeks,
} = require('../popup.js');

test.each([
  [20000, '10.26'],
  [30000, '15.38'],
  [40000, '20.51'],
])(
  'getHourlyRate for salary %d',
  (salary, expected, hoursPerDay = 7.5, daysPerWeek = 5) => {
    expect(getHourlyRate(salary, hoursPerDay, daysPerWeek).toFixed(2)).toBe(
      expected
    );
  }
);

test.each([
  [20000, '76.92'],
  [30000, '115.38'],
  [40000, '153.85'],
])(
  'getDailyRate for salary %d',
  (salary, expected, hoursPerDay = 7.5, daysPerWeek = 5) => {
    expect(getDailyRate(salary, hoursPerDay, daysPerWeek).toFixed(2)).toBe(
      expected
    );
  }
);

test.each([
  [20000, '384.62'],
  [30000, '576.92'],
  [40000, '769.23'],
])(
  'getWeeklyRate for salary %d',
  (salary, expected, hoursPerDay = 7.5, daysPerWeek = 5) => {
    expect(getWeeklyRate(salary, hoursPerDay, daysPerWeek).toFixed(2)).toBe(
      expected
    );
  }
);

test.each([
  [1000, 20000, '97.50'],
  [2000, 30000, '130.00'],
  [3000, 40000, '146.25'],
])(
  'getCostInHours for salary %d',
  (totalCost, salary, expected, hoursPerDay = 7.5, daysPerWeek = 5) => {
    expect(getCostInHours(totalCost, salary, hoursPerDay, daysPerWeek)).toBe(
      expected
    );
  }
);

test.each([
  [1000, 20000, '13.00'],
  [2000, 30000, '17.33'],
  [3000, 40000, '19.50'],
])(
  'getCostInDays for salary %d',
  (totalCost, salary, expected, hoursPerDay = 7.5, daysPerWeek = 5) => {
    expect(getCostInDays(totalCost, salary, hoursPerDay, daysPerWeek)).toBe(
      expected
    );
  }
);

test.each([
  [1000, 20000, '2.60'],
  [2000, 30000, '3.47'],
  [3000, 40000, '3.90'],
])(
  'getCostInWeeks for salary %d',
  (totalCost, salary, expected, hoursPerDay = 7.5, daysPerWeek = 5) => {
    expect(getCostInWeeks(totalCost, salary, hoursPerDay, daysPerWeek)).toBe(
      expected
    );
  }
);
