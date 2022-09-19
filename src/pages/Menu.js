import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader, MenuList } from "../components";
import { makeGetRequest } from "../http/API";
import { APPOINTMENT_SLOTS } from "../http/Costants";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentTypes, insuranceOptions, locationId } = location.state;

  // Holds State about the loading when the request is hapening to the server
  const [loading, setLoading] = useState(false);

  // Holds the selected values by user on the menu list
  const [selectedMenuItems, setSelectedMenuItems] = useState({
    type: "",
    option: "",
  });

  useEffect(() => {
    // function to fetch slots from the server
    const fetchAppointmentSlots = async () => {
      // If both(Appointment Type and insurance options) are selected the do request for slots to the server
      if (selectedMenuItems.type && selectedMenuItems.option) {
        try {
          setLoading(true);
          const { status, data } = await makeGetRequest(
            `${APPOINTMENT_SLOTS}?location=${locationId}&appointment_type=${
              selectedMenuItems.type
            }&insurance_option=${
              selectedMenuItems.option
            }&date=${new Date().toDateString()}`
          );

          // If got response OK then move to the slots screens
          if (status === 200) {
            navigate(`/schedulling/${locationId}/slots`, {
              state: {
                slotsData: data,
              },
            });
          }
        } catch (err) {
          navigate(`/schedulling/${locationId}/slots`, {
            state: {
              slotsData: [],
            },
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointmentSlots();
  }, [selectedMenuItems, locationId, navigate]);

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-3xl font-semibold">
        Top Level Practice Name
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto my-4 ">
          <div className="bg-[#ffffff] rounded-t-3xl rounded-br-3xl px-10 py-4 space-y-6">
            <MenuList
              type={"type"}
              setSelectedMenuItems={setSelectedMenuItems}
              selectedMenuItems={selectedMenuItems}
              heading="What type of appointment would you like to schedule?"
              menuList={appointmentTypes.result}
            />
            <MenuList
              type={"option"}
              selectedMenuItems={selectedMenuItems}
              setSelectedMenuItems={setSelectedMenuItems}
              heading="Choose your insurance"
              menuList={insuranceOptions.result}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
