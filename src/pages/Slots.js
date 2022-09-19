import { useLocation } from "react-router-dom";

const Slots = () => {
  const location = useLocation();
  const { slotsData } = location.state;
  console.log({ slotsData });
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-3xl font-semibold">
        Location 1
      </h1>

      <h1 className="text-center font-bold text-xl mt-10">Slots Page Still Need to design</h1>
    </div>
  );
};

export default Slots;
