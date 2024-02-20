import moment from "moment";

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const formatValue = (v) => {
  return v ? Math.round(v * 100) / 100 : null;
};

export const toPositive = (v) => {
  if (isNaN(v) || !isFinite(v)) return 0;
  return Number(v) < 0 ? Number(v) * -1 : Number(v);
};

export const safeDivide = (val1, val2) => {
  return !isFinite(val1 / val2) || isNaN(val1 / val2)
    ? 0
    : formatValue(val1 / val2);
};
export const safePercent = (val1, val2) => {
  return !isFinite(val1 / val2) || isNaN(val1 / val2)
    ? 0
    : formatValue((val1 / val2) * 100);
};
export const safeSubtract = (val1, val2) => {
  return isNaN(val1 - val2) ? 0 : formatValue(val1 - val2);
};

export const safeSum = (val1, val2) => {
  let sum = 0;
  if (!isNaN(Number(val1))) {
    sum = sum + val1;
  }
  if (!isNaN(Number(val2))) {
    sum = sum + val2;
  }

  return formatValue(sum);
};

export const getMonthName = (month, isLong = false) => {
  return new Date(2020, month - 1, 1).toLocaleString("en-us", {
    month: isLong ? "long" : "short",
  });
};

export const getAllDaysInMonth = (month, year) =>
  Array.from(
    { length: new Date(year, month, 0).getDate() }, // get next month, zeroth's (previous) day
    (_, i) => new Date(year, month - 1, i + 1) // get current month (0 based index)
  );

export const getDaysInWeek = (current) => {
  var week = [];
  // Starting Monday not Sunday
  current.setDate(current.getDate() - current.getDay() + 1);
  for (var i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return week;
};

export const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

export const UAEFormatNumber = (value) => {
  // return new Intl.NumberFormat("en-US", {
  return new Intl.NumberFormat("ar-AE", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value.replace(/,/g, "")));
};

export const twenty4HourTo12Hour = (value) => {
  return moment(value, "h:mm:ss").format("hh:mm A");
};

export const getTechniciansTotalAvailableTime = (numberOfTechnicians) => {
  const percentage = 85;
  const technicianWorkingHours = 10;
  return Math.floor(
    (percentage / 100) * (numberOfTechnicians * technicianWorkingHours)
  );
};
