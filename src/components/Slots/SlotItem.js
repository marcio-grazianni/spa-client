import { useEffect, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const SlotItem = ({
  selectedSlotTime = "",
  dataArray = [],
  providername = "",
  setReqData = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Holds the list of slots to render on the screen
  const [slotsList, setSlotsList] = useState([]);

  useEffect(() => {
    dataArray.length > 3
      ? setSlotsList(dataArray.slice(0, 3))
      : setSlotsList(dataArray);
  }, [dataArray]);
  return (
    <div>
      {slotsList?.map(({ _id, status, time }) => (
        <div
          key={_id}
          onClick={() => {
            if (status === "available") {
              setReqData({ providername, slotTime: time });
            }
          }}
          className={`${
            selectedSlotTime === time && "bg-[#d80b6d] border-[#d80b6d]"
          } ${
            status === "available" &&
            "bg-[#652293] border-[#652293] text-[#ffffff]"
          } ${
            status === "unavailable" &&
            "bg-[lightgray] border-[lightgray] text-[#000000]"
          } rounded-md border-4 w-full   text-center font-semibold duration-300 my-2 `}
        >
          <div>
            {new Date(time).toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      ))}
      {dataArray.length > 3 && (
        <div
          onClick={() => {
            setIsOpen(!isOpen);

            isOpen
              ? setSlotsList(dataArray.slice(0, 3))
              : setSlotsList(dataArray);
          }}
          className="text-center w-full  bg-[#ffffff] border font-semibold border-slate-500 rounded-md"
        >
          {!isOpen ? (
            <div className="flex items-center justify-center">
              <span>More</span>
              <BsChevronDown />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span>Less</span>
              <BsChevronUp />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotItem;
