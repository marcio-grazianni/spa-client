import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SlotsHeader, SlotsList } from "../components";
import { makeGetRequest, makePostRequest } from "../http/API";
import {
  APPOINTMENT_TYPES,
  BOOKAPPOINTMENT,
  INSURANCE_OPTIONS,
} from "../http/Costants";
import getDates from "../utils/getDates";
import reorderDates from "../utils/reorderDates";

const Slots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useParams();
  const { slotsData, appointmentTypes, insuranceOptions, locationId } =
    location.state;
  const [newSlotsData] = reorderDates(slotsData.result[0]);
  slotsData.result[0] = newSlotsData;
  // Handle the state about is it scrolling or not
  const [isScrolling, setIsScrolling] = useState(false);
  // Holds the loading state to show loading when the backend request is happening
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(getDates({ date, direction: "after" }));
  // Holds data to do req to book an appointment
  const [reqData, setReqData] = useState({
    providerName: "",
    slotTime: "",
  });

  // Hold the state about how many time it is scrolled
  const [scrollTime, setScrollTime] = useState(0);

  // Holds the date
  // const [datesArray,setDatesArray]
  // Holds How many number of days in the current month
  const [noOfDays, setNoOfDays] = useState("");

  useLayoutEffect(() => {
    var now = date;
    setNoOfDays(dates.length);
  }, [dates]);
  // Reference for the Slot headers
  const ref = useRef(null);
  // Reference for the Slots container
  const ref2 = useRef(null);

  const scroll = (scrollOffset) => {
    if (!isScrolling) {
      if (+scrollOffset.toString().includes("-")) {
        setScrollTime(scrollTime - 1);
      } else {
        const newDate = new Date(date);
        if (newDate.getDate() + scrollTime + 2 === noOfDays) {
          if (date.getMonth() === newDate.getMonth()) {
            return;
          }
        }
        setScrollTime(scrollTime + 1);
      }
      setIsScrolling(true);
      ref.current.scrollTo({
        left: ref.current?.scrollLeft + scrollOffset,
        behavior: "smooth",
      });

      ref2.current.scrollTo({
        left: ref.current?.scrollLeft + scrollOffset,
        behavior: "smooth",
      });
      setTimeout(() => {
        setIsScrolling(false);
      }, 250);
    }
  };

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
      <div className="xxs:max-w-[320px] xs:max-w-[432px] md:max-w-[704px] w-full px-4  mx-auto my-4 space-y-4">
        <SlotsHeader
          scrollTime={scrollTime}
          date={date}
          setDate={setDate}
          setScrollTime={setScrollTime}
          scroll={scroll}
          divRef={ref}
          noOfDays={noOfDays}
          setNoOfDays={setNoOfDays}
          dates={dates}
          setDates={setDates}
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
              dates={dates}
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
