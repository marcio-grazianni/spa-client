const SlotItem = ({ status, time }) => {
  return (
    <div
      className={`${status === "available" && "bg-[#652293] text-[#ffffff]"} ${
        status === "unavailable" && "bg-[lightgray] text-[#000000]"
      } rounded-md text-center font-semibold w-24 py-1 md:px-1 px-2 `}
    >
      {new Date(time).toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}
    </div>
  );
};

export default SlotItem;
