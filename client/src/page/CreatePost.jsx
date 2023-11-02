// Import necessary modules and components
import React, { useState } from "react";  // Import React and the useState hook from react
import { useNavigate } from "react-router-dom";  // Import useNavigate hook from react-router-dom for programmatic navigation

import { preview } from "../assets";  // Import preview image from assets
import { getRandomPrompt } from "../utils";  // Import utility function to get random prompt
import { FormField, Loader } from "../components";  // Import FormField and Loader components from components folder

// Define a functional component named CreatePost
const CreatePost = () => {

  // Use useNavigate hook to get the navigate function for programmatic navigation
  const navigate = useNavigate();

  // Declare form state object using useState hook, initializing with an object with empty strings
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  // Declare generatingImg state variable to track if an image is being generated, initializing with false
  const [generatingImg, setGeneratingImg] = useState(false);

  // Declare loading state variable to track if form is being submitted, initializing with false
  const [loading, setLoading] = useState(false);

  // Define a function to handle input changes and update form state
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });  // Use setForm to update state, spreading existing form object and updating the changed field

  // Define a function to handle Surprise Me button click
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);  // Get a random prompt using utility function
    setForm({ ...form, prompt: randomPrompt });  // Update the form state with the new random prompt
  };

  // Define an async function to handle image generation
  const generateImage = async () => {
    if (form.prompt) {  // Check if prompt is provided
      try {
        setGeneratingImg(true);  // Set generatingImg to true indicating image generation started
        const response = await fetch(  // Send a POST request to the DALL-E API
          "https://dalle-arbb.onrender.com/api/v1/dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",  // Set content type to JSON
            },
            body: JSON.stringify({
              prompt: form.prompt,  // Send the prompt from form state as the request body
            }),
          }
        );

        const data = await response.json();  // Parse the response as JSON
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });  // Update the form state with the generated photo
      } catch (err) {
        alert(err);  // Show an alert if there's an error
      } finally {
        setGeneratingImg(false);  // Set generatingImg to false indicating image generation ended
      }
    } else {
      alert("Please provide proper prompt");  // Show an alert if prompt is not provided
    }
  };

  // Define an async function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    if (form.prompt && form.photo) {  // Check if prompt and photo are provided
      setLoading(true);  // Set loading to true indicating form submission started
      try {
        const response = await fetch(  // Send a POST request to the server
          "https://dalle-arbb.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",  // Set content type to JSON
            },
            body: JSON.stringify({ ...form }),  // Send the form state object as the request body
          }
        );

        await response.json();  // Parse the response as JSON
        alert("Success");  // Show a success alert
        navigate("/");  // Navigate to the home page
      } catch (err) {
        alert(err);  // Show an alert if there's an error
      } finally {
        setLoading(false);  // Set loading to false indicating form submission ended
      }
    } else {
      alert("Please generate an image with proper details");  // Show an alert if prompt or photo is not provided
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Generate an imaginative image through DALL-E AI and share it with the
          community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
