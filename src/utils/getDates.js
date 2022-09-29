const getDates = ({ date, number = 2, direction = "before" }) => {
  let dates = [date];
  for (let i = 0; i < number; i++) {
    const newDate = new Date(date);

    if (direction === "after") {
      newDate.setDate(date.getDate() + i + 1);
      dates.push(newDate);
    } else {
      newDate.setDate(date.getDate() - i - 1);
      dates.unshift(newDate);
    }
  }

  return dates;
};
export default getDates;
