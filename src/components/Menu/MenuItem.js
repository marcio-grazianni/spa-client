import { TiTickOutline } from "react-icons/ti";

const MenuItem = ({
  name,
  type = "",
  setSelectedMenuItems = () => {},
  selectedMenuItems = {},
}) => {
  return (
    <li
      onClick={() => {
        setSelectedMenuItems({
          ...selectedMenuItems,
          [type]: name,
        });
      }}
      className={`${
        selectedMenuItems[type] === name
          ? "bg-[#652293] border-[blue] text-[#ffffff]"
          : "bg-[#e6e6e6]"
      }  rounded-md p-1.5 border border-[#e6e6e6] flex items-center justify-between duration-300 hover:bg-[#652293] hover:border-[blue] hover:text-[#ffffff]`}
    >
      {name}
      {selectedMenuItems[type] === name && (
        <TiTickOutline style={{ fontSize: "1.5rem", fill: "white" }} />
      )}
    </li>
  );
};

export default MenuItem;
