import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { makePostRequest } from "../../http/API";
import { INBOUND } from "../../http/Costants";

const Form = () => {
  // Navigation to navigate Screen
  const navigate = useNavigate();

  // Hook form for the Form Validaton
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // Holds the selected type on button click
  const [type, setType] = useState("");

  // Holds State about the loading when the request is hapening to the server
  const [loading, setLoading] = useState(false);

  // Calls On submiting the form
  const submitHandler = async (data) => {
    const { name, phone, email } = data;
    try {
      setLoading(true);
      // Make POST req to the server and destructure status from the response
      const { status, data } = await makePostRequest(INBOUND, {
        name,
        phone,
        email,
        type,
      });
      // If data successfully inserted into the database
      if (status === 200) {
        // Navigate to the contact success screen
        navigate("/contactsuccess", {
          state: {
            userId: data._id,
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-3">
      <div className="ml-6 bg-[#ffffff] text-[#652293] px-6 py-2.5 md:py-5 rounded-t-3xl rounded-bl-3xl space-y-3">
        <div>
          <label className="font-bold text-base">Name*</label>
          <input
            {...register("name", { required: true })}
            className={`${
              errors.name?.message === "" && " border-[red] "
            } outline-none py-1 border-b-2 w-full focus:border-[#652293]`}
          />
        </div>
        <div>
          <label className="font-bold text-base">Mobile Phone*</label>
          <input
            {...register("phone", {
              required: true,
              pattern: {
                value: /^[0-9+]+$/i,
                message: "Please enter a valid phone number",
              },
            })}
            className={`${
              errors.phone?.message === "" && " border-[red] "
            } outline-none py-1 border-b-2 w-full focus:border-[#652293]`}
          />
        </div>
        <p className="text-[red] text-sm">{errors.phone?.message}</p>
        <div>
          <label className="font-bold text-base">Email*</label>
          <input
            {...register("email", {
              required: true,
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Please enter a valid email",
              },
            })}
            className={`${
              (errors.email?.message === "" ||
                errors.email?.message === "Please enter a valid email") &&
              " border-[red] "
            } outline-none py-1 border-b-2 w-full focus:border-[#652293]`}
          />
        </div>
        <p className="text-[red] text-sm">{errors.email?.message}</p>
      </div>
      <div className="mx-6 space-y-2">
        <button
          type="button"
          onFocus={() => {
            setType("appointment");
          }}
          onClick={handleSubmit(submitHandler)}
          className={`${
            loading && "opacity-50"
          } bg-[#652293] w-full   text-[#ffffff] py-2.5 font-bold hover:bg-transparent border border-[#652293] duration-500 hover:text-[#652293]`}
        >
          Book Appointment
        </button>
        <button
          type="button"
          onFocus={() => {
            setType("message");
          }}
          onClick={handleSubmit(submitHandler)}
          className={`${
            loading && "opacity-50"
          } bg-[#652293] w-full  text-[#ffffff] py-2.5 font-bold hover:bg-transparent border border-[#652293] duration-500 hover:text-[#652293]`}
        >
          Start Chat
        </button>
      </div>
    </form>
  );
};

export default Form;
