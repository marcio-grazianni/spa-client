import { useLocation } from "react-router-dom";

const SlotBook = () => {
  const { state } = useLocation();
  const { reqData } = state;
  const { providername, slotTime } = reqData;
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-3xl font-semibold">
        Location 1
      </h1>
      <div className="max-w-[697px] w-full px-4  mx-auto my-4 space-y-4">
        <div className="bg-[#ffffff] flex items-center justify-between flex-col sm:flex-row px-6 py-4 space-y-2 sm:space-y-0">
          <div className=" space-y-4">
            <div className="flex items-center space-x-2">
              <img
                className="rounded-full h-14 w-14 object-contain "
                src="https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                alt="avatar"
              />
              <div>
                <p className="opacity-60 text-xs">Dentist</p>
                <h1 className="text-base font-semibold">{providername}</h1>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-[#652293] font-bold text-xl sm:text-3xl text-center">
              {new Date(slotTime).toLocaleString()}
            </h1>
          </div>
        </div>

        <div className="bg-[#ffffff] text-[#652293] flex items-center justify-center flex-col h-80 md:h-96 text-center rounded-t-3xl rounded-br-3xl px-8">
          <h1 className="font-bold text-2xl sm:text-3xl">
            Your Appointment has been scheduled!
          </h1>
          <h2 className="font-bold text-lg sm:text-xl">
            Appointment updates will be sent via text.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SlotBook;
