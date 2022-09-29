const reorderDates = (dates) => {
  const slots = [...dates.slots];

  slots.sort((a, b) => new Date(a.time) - new Date(b.time));
  const timeDates = slots.map(({ time }) =>
    new Date(time).toLocaleDateString()
  );
  const uniqueDates = [...new Set(timeDates)];
  dates.slots = slots;
  return [dates, uniqueDates];
};
export default reorderDates;
