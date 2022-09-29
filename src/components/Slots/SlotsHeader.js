import { useLayoutEffect, useState } from "react";
import { GoCalendar } from "react-icons/go";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { locale } from "moment/moment";

import "react-datepicker/dist/react-datepicker.css";
import getDates from "../../utils/getDates";

const SlotsHeader = ({
  setScrollTime = () => {},
  scrollTime = "",
  date = "",
  setDate = () => {},
  divRef,
  // scroll,
  noOfDays,
  dates,
  setDates,
}) => {
  const [calendarData, setCalendarData] = useState([]);
  // Do scroll to that date when date is changed from right side

  useLayoutEffect(() => {
    divRef?.current?.scrollTo({
      top: 0,
      left: dates.indexOf(date) * 112,
      behavior: "smooth",
    });
  }, [date, divRef, calendarData, dates]);

  // Make calendar data to display in the horizontal slider
  useLayoutEffect(() => {
    function getDayAndDate(dateStr) {
      var date = new Date(dateStr);
      const day = date.toLocaleDateString(locale, { weekday: "short" });
      return day;
    }
    let arr = [];
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const fullYear = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      arr.push(
        `${getDayAndDate(new Date(`${month + 1}/${day}/${fullYear}`))} ${day}`
      );
    }
    setCalendarData(arr);
  }, [dates]);
  const changeDate = (newDate) => {
    if (newDate.getMonth() === new Date().getMonth()) {
      if (newDate.getDate() === new Date().getDate()) {
        // setScrollTime(0);
      } else {
        const date1 = new Date(date.toLocaleDateString());
        const date2 = new Date(newDate.toLocaleDateString());
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // setScrollTime(diffDays - 2);
      }
    }
    const newDates = getDates({ date: newDate, direction: "after", number: 2 });

    let changedDates = newDates.map((date) => new Date(date).toISOString());

    const uniqueDates = [...new Set(changedDates)];

    setDate(newDate);
    setDates(uniqueDates);
  };
  const changeDates = (direction, newDate) => {
    let uniqueDates;
    let newDates;
    if (direction === "before") {
      newDates = getDates({ date: newDate, direction, number: 2 });
    } else {
      newDates = getDates({ date: newDate, direction, number: 2 });
    }
    let changedDates = newDates.map((date) => new Date(date).toISOString());

    uniqueDates = [...new Set(changedDates)];

    setDates(uniqueDates);
    setDate(newDate);
  };

  return (
    <div className="bg-[#ffffff] py-4 px-8">
      <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row">
        <div className=" md:w-[45%] flex justify-center">
          <div className="rounded-full px-4 py-1 bg-[#e6e6e6] flex items-center w-36">
            <DatePicker
              placeholderText="Select Date"
              className="bg-transparent w-full outline-none"
              selected={date}
              onChange={(date) => changeDate(date)}
            />
            <GoCalendar />
          </div>
        </div>
        <div className="md:w-[55%] ">
          <div className="flex justify-center mb-2">
            <h2 className="font-semibold text-lg">{`${date.toLocaleString(
              "default",
              {
                month: "short",
              }
            )} ${date.getFullYear()}`}</h2>
          </div>
          <div className="relative flex items-center">
            <div className="absolute top-1/2 bg-[#ffffff] z-0  -translate-y-1/2 left-0">
              <BsChevronLeft
                onClick={() => {
                  const addDate = new Date(
                    date.getTime() - 24 * 60 * 60 * 1000
                  );
                  changeDates("before", addDate);
                  changeDate(addDate);
                  // scroll(112);
                }}
              />
            </div>
            <div
              ref={divRef}
              className=" flex overflow-hidden space-x-3 noScrollbar"
            >
              {calendarData.map((date, index) => (
                <div key={index} className="min-w-[100px] text-center">
                  {date}
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 bg-[#ffffff] z-0 -translate-y-1/2 right-0">
              <BsChevronRight
                onClick={() => {
                  const addDate = new Date(
                    date.getTime() + 24 * 60 * 60 * 1000
                  );
                  changeDates("after", addDate);

                  changeDate(addDate);
                  // scroll(112);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsHeader;
