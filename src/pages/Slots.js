import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SlotsHeader, SlotsList } from "../components";
import { makeGetRequest, makePostRequest } from "../http/API";
import {
  APPOINTMENT_TYPES,
  BOOKAPPOINTMENT,
  INSURANCE_OPTIONS,
} from "../http/Costants";

const Slots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useParams();
  const { slotsData, appointmentTypes, insuranceOptions, locationId } =
    location.state;

  // Holds the loading state to show loading when the backend request is happening
  const [loading, setLoading] = useState(false);

  // Holds data to do req to book an appointment
  const [reqData, setReqData] = useState({
    providerName: "",
    slotTime: "",
  });

  // Holds the date
  const [date, setDate] = useState(new Date());

  // Holds How many number of days in the current month
  const [noOfDays, setNoOfDays] = useState("");
  useEffect(() => {
    var now = new Date();
    setNoOfDays(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
  }, [setNoOfDays]);
  // Reference for the Slot headers
  const ref = useRef(null);
  // Reference for the Slots container
  const ref2 = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollTo({
      left: ref.current?.scrollLeft + scrollOffset,
      behavior: "smooth",
    });

    ref2.current.scrollTo({
      left: ref.current?.scrollLeft + scrollOffset,
      behavior: "smooth",
    });
  };

  // Do scroll to that date when date is changed from right side
  useEffect(() => {
    ref?.current?.scrollTo({
      top: 0,
      left: (date.getDate() - 1) * 112,
      behavior: "smooth",
    });
    ref2?.current?.scrollTo({
      top: 0,
      left: (date.getDate() - 1) * 112,
      behavior: "smooth",
    });
  }, [date, ref, ref2]);

  // Runs When User click on Continue button
  const continueHandler = async () => {
    // makePostRequest
    if (reqData.slotTime !== "" && reqData.providerName !== "") {
      try {
        setLoading(true);
        const { status } = await makePostRequest(BOOKAPPOINTMENT, {
          location: locationId,
          appointment_type: appointmentTypes,
          insurance_option: insuranceOptions,
          provider_name: reqData.providerName,
          slot_time: reqData.slotTime,
          patient_name: "Patient 1 (placeholder)",
        });
        if (status === 200) {
          navigate("/schedulling/:user/slotbook", {
            state: {
              reqData: reqData,
            },
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Runs When User click on Back button
  const backHandler = async () => {
    try {
      setLoading(true);
      const appointmentTypesRes = await makeGetRequest(
        `${APPOINTMENT_TYPES}?location=${locationId}`
      );
      const insuranceOptionsRes = await makeGetRequest(
        `${INSURANCE_OPTIONS}?location=${locationId}`
      );

      // Destructuring Status from the response
      const { status: appointmentResStatus } = appointmentTypesRes;
      const { status: insuranceOptionsStatus } = insuranceOptionsRes;

      // Checking is status is OK from the response and then navigate to the menu Screen
      if (appointmentResStatus === 200 && insuranceOptionsStatus === 200) {
        navigate(`/schedulling/${user}/menu`, {
          state: {
            appointmentTypes: appointmentTypesRes.data,
            insuranceOptions: insuranceOptionsRes.data,
            locationId,
          },
        });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-3xl font-semibold">
        Location 1
      </h1>
      <div className="max-w-[697px] w-full px-4  mx-auto my-4 space-y-4">
        <SlotsHeader
          date={date}
          setDate={setDate}
          scroll={scroll}
          divRef={ref}
          noOfDays={noOfDays}
        />
        {slotsData.result &&
          slotsData?.result?.map((data) => (
            <SlotsList
              date={date}
              selectedSlotTime={reqData.slotTime}
              setReqData={setReqData}
              key={data._id}
              data={data}
              divRef={ref2}
              noOfDays={noOfDays}
            />
          ))}

        <div
          className={`${
            loading && "opacity-50"
          } flex items-center justify-between`}
        >
          <button
            disabled={loading}
            onClick={() => {
              backHandler(locationId);
            }}
            className="py-2 px-6 sm:px-10 md:px-20 bg-[#652293] text-[#ffffff] font-semibold"
          >
            Back
          </button>
          <button
            disabled={loading}
            onClick={continueHandler}
            className="py-2 px-6 sm:px-10 md:px-20 bg-[#652293] text-[#ffffff] font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slots;
