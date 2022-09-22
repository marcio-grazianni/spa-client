import React, { useEffect, useState } from "react";
import SlotItem from "./SlotItem";

const SlotsList = ({
  date = "",
  data,
  divRef = "",
  noOfDays,
  selectedSlotTime = "",
  setReqData = () => {},
}) => {
  // Holds the array of data of the slots of each month
  const [slotsDataTransformed, setSlotsDataTransformed] = useState([]);

  //  Transform database response
  useEffect(() => {
    let arr = [];

    const validate = (time, number) => {
      const month = new Date(time).getMonth();
      const resDate = new Date(time).getDate();
      return resDate === number && month === date.getMonth() ? time : null;
    };

    for (let i = 0; i < noOfDays; i++) {
      const number = i + 1;
      const response = data.slots.filter((data) => validate(data.time, number));
      arr.push(response);
    }
    setSlotsDataTransformed(arr);
  }, [noOfDays, data.slots, date]);

  return (
    <div className="rounded-t-3xl rounded-br-3xl bg-[#ffffff] py-4 px-8 ">
      <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row">
        <div className="md:w-[45%] space-y-4">
          <div className="flex items-center space-x-2">
            <img
              className="rounded-full h-14 w-14 object-contain "
              src="https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
              alt="avatar"
            />
            <div>
              <p className="opacity-60 text-xs">Dentist</p>
              <h1 className="text-base font-semibold">{data.provider_name}</h1>
            </div>
          </div>

          <div className="text-[#652293]">
            <h1 className="font-semibold text-2xl">Next Availability:</h1>
            <h3>{new Date(data.next_available_date).toDateString()}</h3>
          </div>
        </div>
        <div className="md:w-[55%] overflow-y-auto noScrollbar relative">
          <div
            ref={divRef}
            className=" flex overflow-auto space-x-3 noScrollbar"
          >
            {slotsDataTransformed.map((dataArray, index) => (
              <div className="min-w-[100px]" key={index}>
                <SlotItem
                  dataArray={dataArray}
                  providername={data.provider_name}
                  selectedSlotTime={selectedSlotTime}
                  setReqData={setReqData}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsList;
