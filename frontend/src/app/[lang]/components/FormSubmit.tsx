"use client";
import { useState } from "react";
import { clientFetchAPI } from "@/app/[lang]/utils/client-fetch-api";

export default function FormSubmit ({
  placeholder,
  text,
}: {
  placeholder: string;
  text: string;
}) {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit () {
    if (email === "") {
      setErrorMessage("Email cannot be blank.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    const res = await clientFetchAPI("/lead-form-submissions",  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { data: { email } },
    });

    if (!res.ok) {
      setErrorMessage("Email failed to submit.");
      return;
    }
    setEmail("");
    setErrorMessage("");
    setSuccessMessage("Email successfully submitted!");
  }

  return <div className="flex flex-row items-center self-center justify-center flex-shrink-0 shadow-md lg:justify-end rounded-lg">
    <div className="flex flex-col">
      <div className="flex flex-row">
        {successMessage ? <p className="text-green-700 bg-green-300 px-4 py-2 rounded-lg">{successMessage}</p> : <>
          <input
            type="email"
            value={email}
            placeholder={errorMessage || placeholder}
            className={"w-3/5 p-3 rounded-l-lg sm:w-2/3 text-gray-700"}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-2/5 p-3 font-semibold rounded-r-lg sm:w-1/3 dark:bg-violet-400 dark:text-gray-900"
          >
            {text}
          </button>
        </>}
      </div>

      {errorMessage && <p className="text-red-500 bg-red-200 px-4 py-2 rounded-lg my-2">{errorMessage}</p>}
    </div>
  </div>;
}
