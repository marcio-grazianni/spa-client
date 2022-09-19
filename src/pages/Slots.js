import { useLocation } from "react-router-dom";
import { SlotsList } from "../components";

const Slots = () => {
  const location = useLocation();
  const { slotsData } = location.state;
  console.log(slotsData);
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-3xl font-semibold">
        Location 1
      </h1>
      <div className="max-w-7xl mx-auto my-4 space-y-6">
        {slotsData.result &&
          slotsData?.result?.map((data) => <SlotsList key={data._id} data={data} />)}
      </div>
    </div>
  );
};

export default Slots;
