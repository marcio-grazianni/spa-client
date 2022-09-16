import { Form } from "../components";

const Contact = () => {
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-[#652293] border-[#652293] border-b text-center py-3 text-xl font-medium ">
        Provider/practice name Name
      </h1>

      <div className="max-w-[380px] w-full mx-auto py-2.5 md:py-6 px-5 space-y-3">
        <div className="bg-[#ffffff] text-[#652293] px-10 py-2 rounded-t-3xl rounded-br-3xl">
          <h2 className="font-bold text-lg">
            Tell us about yourself, our concierge team will help coordinate.
          </h2>
        </div>
        <Form />

        {/* <div className="bg-[#ffffff] rounded-t-3xl rounded-br-3xl rounded-bl-md px-4 py-20">
          <h1 className="font-semibold text-left text-[#652293] text-2xl">
            You're all set! We just sent you a message to confirm your request.
          </h1>
        </div> */}
        <p className="text-center max-w-[300px] mx-auto text-sm font-medium text-[#652293] mt-2">
          Messaging & data rates may apply. Use is subject to term
        </p>
      </div>
    </div>
  );
};

export default Contact;
