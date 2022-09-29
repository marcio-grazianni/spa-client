import { Form } from "../components";

const Contact = () => {
  return (
    <div className="w-full flex flex-col">
      <h1 className="text-[#652293] w-full border-[#652293] border-b text-center py-3 text-xl font-medium ">
        Provider/practice name Name
      </h1>

      <div className="max-w-[380px] flex flex-col items-stretch w-full flex-1 mx-auto py-2.5 md:py-6 px-5 space-y-3">
        <div className="bg-[#E4E9EF] text-[#652293] px-10 py-2 rounded-t-3xl rounded-br-3xl mr-6">
          <h2 className="font-bold text-lg">
            Tell us about yourself, our concierge team will help coordinate.
          </h2>
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <Form />
          <p className="text-center  max-w-[300px] mx-auto text-sm font-medium text-[#652293] mt-2">
            Messaging & data rates may apply. Use is subject to term
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
