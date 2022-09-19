import MenuItem from "./MenuItem";

const MenuList = ({
  type = "",
  setSelectedMenuItems = () => {},
  selectedMenuItems = {},
  heading,
  menuList,
}) => {
  return (
    <div>
      <h1 className="text-xl font-semibold">{heading}</h1>
      <ul className="my-2 space-y-1">
        {menuList &&
          menuList.map(({ name, id }) => (
            <MenuItem
              selectedMenuItems={selectedMenuItems}
              type={type}
              setSelectedMenuItems={setSelectedMenuItems}
              name={name}
              key={id}
            />
          ))}
      </ul>
    </div>
  );
};

export default MenuList;
