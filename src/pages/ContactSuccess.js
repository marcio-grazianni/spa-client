import { Link, useLocation } from "react-router-dom";

const ContactSuccess = () => {
  const location = useLocation();
  const { userId } = location.state;
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-xl font-medium ">
        Provider/practice name Name
      </h1>

      <div className="max-w-[350px] flex-1 w-full mx-auto py-2.5 md:py-6 px-5 space-y-3">
        <Link
          to={`/schedulling/${userId}`}
          type="button"
          className="bg-[#652293] w-full text-center  text-[#ffffff] py-2.5 font-bold hover:bg-transparent border border-[#652293] duration-500 hover:text-[#652293]"
        >
          Book Appointment
        </Link>
        <button
          type="button"
          className="bg-[#652293] w-full  text-[#ffffff] py-2.5 font-bold hover:bg-transparent border border-[#652293] duration-500 hover:text-[#652293]"
        >
          Start Chat
        </button>

        <div className="bg-[#E4E9EF] rounded-t-3xl rounded-br-3xl rounded-bl-md px-4 py-20">
          <h1 className="font-bold text-left text-[#652293] text-2xl">
            You're all set! We just sent you a message to confirm your request.
          </h1>
        </div>
        <p className="text-center max-w-[300px] absolute bottom-20 mx-auto text-sm font-medium text-[#652293] mt-2">
          Messaging & data rates may apply. Use is subject to term
        </p>
      </div>
    </div>
  );
};

export default ContactSuccess;
