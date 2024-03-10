import moment from "moment";

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const formatValue = (v) => {
  return v ? Math.round(v * 100) / 100 : null;
};

export const twenty4HourTo12Hour = (value) => {
  return moment(value, "h:mm:ss").format("hh:mm A");
};
