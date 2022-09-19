import React from "react";
import SlotItem from "./SlotItem";

const SlotsList = ({ data }) => {
  console.log(data);
  return (
    <div className="rounded-t-3xl rounded-br-3xl bg-[#ffffff] py-4 px-8 ">
      <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row">
        <div className="flex-1 space-y-4">
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
        <div className="flex-1 md:w-[450px]">
          <div className="max-h-[315px] noScrollbar overflow-y-auto grid grid-cols-3 gap-2">
            {data.slots.map(({ status, time, _id }) => (
              <SlotItem key={_id} status={status} time={time} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsList;
