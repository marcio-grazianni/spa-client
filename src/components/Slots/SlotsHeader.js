import { useEffect, useState } from "react";
import { GoCalendar } from "react-icons/go";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { locale } from "moment/moment";

import "react-datepicker/dist/react-datepicker.css";

const SlotsHeader = ({
  date = "",
  setDate = () => {},
  divRef,
  scroll,
  noOfDays,
}) => {
  const [calendarData, setCalendarData] = useState([]);

  // Make calendar data to display in the horizontal slider
  useEffect(() => {
    var now = date;
    function getDayAndDate(dateStr) {
      var date = new Date(dateStr);
      const day = date.toLocaleDateString(locale, { weekday: "short" });
      return day;
    }
    let arr = [];
    for (let i = 0; i < noOfDays; i++) {
      const fullYear = now.getFullYear();
      const month = now.getMonth();
      arr.push(
        `${getDayAndDate(new Date(`${month + 1}/${i + 1}/${fullYear}`))} ${
          i + 1
        }`
      );
    }
    setCalendarData(arr);
  }, [noOfDays, date]);
  return (
    <div className="bg-[#ffffff] py-4 px-8">
      <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row">
        <div className=" md:w-[45%] flex justify-center">
          <div className="rounded-full px-4 py-1 bg-[#e6e6e6] flex items-center w-36">
            <DatePicker
              placeholderText="Select Date"
              className="bg-transparent w-full outline-none"
              selected={date}
              onChange={(date) => setDate(date)}
            />
            <GoCalendar />
          </div>
        </div>
        <div className="md:w-[55%] relative flex items-center">
          <div className="absolute top-1/2 bg-[#ffffff] z-30  -translate-y-1/2 left-0">
            <BsChevronLeft
              onClick={() => {
                scroll(-112);
              }}
            />
          </div>
          <div
            ref={divRef}
            className=" flex overflow-auto space-x-3 noScrollbar"
          >
            {calendarData.map((date, index) => (
              <div
                id={index === 10 ? "10" : "5"}
                key={index}
                className="min-w-[100px] text-center"
              >
                {date}
              </div>
            ))}
          </div>

          <div className="absolute top-1/2 bg-[#ffffff] z-30 -translate-y-1/2 right-0">
            <BsChevronRight
              onClick={() => {
                scroll(112);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsHeader;
