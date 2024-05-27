import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import { Button, Chip, Tooltip, Stepper, Step } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createPostInput } from "harshithrao07-common-app";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const Compose = () => {
  // S3 Bucket Name
  const S3_BUCKET = "socialsbucket";

  // S3 Region
  const REGION = "ap-south-1";

  const [post, setPost] = useState({
    title: "",
    content: "",
    imagePreview: "",
    tags: [],
  });
  const [fileImage, setFileImage] = useState(null);
  const [image, setImage] = useState(null);
  const tags = [
    "Frontend",
    "Backend",
    "System Design",
    "Mathematics",
    "Networking",
    "Data Structures",
    "Algorithms",
    "Machine Learning",
    "Data Science",
    "Computer Fundamentals",
    "Web Security",
    "Devops",
  ];
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [customTag, setCustomTag] = useState([]);
  const navigate = useNavigate();

  const quillRef = useRef(null);

  const handleCustomTag = (e) => {
    if (e.key === "Enter") {
      const { value } = e.target;
      if (value.trim() !== "") {
        if (!tags.includes(value)) {
          if (selectedTags.length < 3) {
            const updatedCustomTags = [...customTag, value];
            setSelectedTags([...selectedTags, value]);
            setPost((prev) => ({
              ...prev,
              tags: [...selectedTags, value],
            }));
            setCustomTag(updatedCustomTags);
          }
        }
        e.target.value = "";
      }
    }
  };

  const deleteCustomTag = (index) => {
    const deletedTag = customTag[index];
    const updatedCustomtags = customTag.filter((_, i) => i !== index);
    setCustomTag(updatedCustomtags);
    const updatedTags = selectedTags.filter((tag, i) => tag !== deletedTag);
    setSelectedTags(updatedTags);
  };

  function Icon({ index }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
        onClick={() => deleteCustomTag(index)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    );
  }

  useEffect(() => {
    // Initialize Quill.js editor
    const quill = new Quill(quillRef.current, {
      theme: "snow", // 'snow' is a rich text editing theme
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }], // Header dropdown
            ["bold", "italic", "underline"], // Text styling buttons
            ["link", "image", "blockquote", "code-block"], // Link, image, and video buttons
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // List buttons
            [{ color: [] }, { background: [] }],
            ["clean"], // Remove formatting button
          ],
          handlers: { image: () => imageHandler() },
        },
      },
      placeholder: "Write something awesome...",
    });

    // Save the Quill instance to the ref
    quillRef.current = quill;

    // Event listener for content change
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        const content = quill.root.innerHTML.trim();
        setPost((prevPost) => ({
          ...prevPost,
          content: content,
        }));
      }
    });

    // Cleanup
    return () => {
      quill.off("text-change");
    };
  }, []);

  const imageHandler = () => {
    const quill = quillRef.current;
    if (!quill) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      try {
        const extension = file.name.split(".")[1];
        let name = file.name.split(".")[0];
        name = name.replace(/\s+/g, ""); // Remove all white spaces

        const key = `${uuidv4()}${name}.${extension}`;
        const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

        // S3 Credentials
        AWS.config.update({
          accessKeyId: process.env.accessKeyId,
          secretAccessKey: process.env.secretAccessKey,
        });

        // Files Parameters
        const params = {
          Bucket: S3_BUCKET,
          Key: key,
          Body: file,
        };

        const s3 = new AWS.S3({
          params: { Bucket: S3_BUCKET },
          region: REGION,
        });

        try {
          await s3.putObject(params).promise();
          console.log("Image uploaded successfully.");

          // Insert the uploaded image into the Quill editor
          const range = quill.getSelection();
          quill.insertEmbed(range ? range.index : 0, "image", imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } catch (err) {
        console.log("Storage err: ", err);
      }
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      imagePreview: image,
    }));
  }, [image]);

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
  }, [selectedTags]);

  useEffect(() => {
    const token = localStorage.getItem("token_socials");

    if (!token) {
      navigate("/signin?message=You have to sign up first!");
    }
  }, []);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const handleImageUpload = async () => {
    const extension = fileImage.name.split(".")[1];
    let name = fileImage.name.split(".")[0];
    name = name.replace(/\s+/g, ""); // Remove all white spaces

    const key = `${uuidv4()}${name}.${extension}`;
    const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    // S3 Credentials
    AWS.config.update({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    });

    // Files Parameters
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: fileImage,
    };

    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    try {
      await s3.putObject(params).promise();
      setImage(imageUrl);
      console.log("Image uploaded successfully.");
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const displayImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setFileImage(file);

    reader.onload = () => {
      const base64String = reader.result;
      setImage(base64String);
    };

    reader.readAsDataURL(file);
  };

  const handleChipClick = (clickedTag) => {
    if (selectedTags.includes(clickedTag)) {
      const updatedTags = selectedTags.filter(
        (selectedTag) => selectedTag !== clickedTag
      );
      setSelectedTags(updatedTags);
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, clickedTag]);
      }
    }
  };

  const handleClick = async () => {
    try {
      let imageUrl;
      if (image) {
        imageUrl = await handleImageUpload();
      }

      const updatedPost = {
        ...post,
        imagePreview:
          post.imagePreview === null || undefined
            ? "https://socialsbucket.s3.ap-south-1.amazonaws.com/placeholder.jpg"
            : imageUrl !== null && imageUrl !== undefined
            ? imageUrl
            : image,
      };

      const validation = createPostInput.safeParse(updatedPost);

      if (!validation.success) {
        setError(validation.error.issues[0].message);
      }

      if (validation.success) {
        setLoading(true);

        const response = await axios.post(
          "http://127.0.0.1:8787/api/v1/auth/posts/upload",
          updatedPost,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_socials")}`,
            },
          }
        );
        console.log(response);
        setLoading(false);

        if (response.status === 200) {
          navigate("/");
        }
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col w-full items-center gap-y-1 mt-5 mb-10">
      <div className={`${activeStep !== 0 && "hidden"} w-10/12`}>
        <input
          value={post.title}
          name="title"
          onChange={handleChange}
          type="text"
          placeholder="Title"
          className="border-none text-4xl mb-4 outline-none py-3 px-5 blog-input w-full"
        />
        <div ref={quillRef} className="h-96 text-2xl font-100" />
      </div>

      <div className={`${activeStep !== 1 && "hidden"}`}>
        {image && (
          <div className="flex justify-center">
            <img src={image} alt="uploaded image" className="my-5 w-1/2" />
          </div>
        )}

        {!image && (
          <div className="flex flex-col justify-center items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-80 h-80"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="mb-4 text-xl">
              Include a high-quality image in your story to make it more
              inviting to readers.
            </span>
            <Tooltip content="Your preview image" placement="bottom">
              <Button
                variant="outlined"
                className="rounded-full outline-none py-2.5 px-3"
              >
                <label
                  className="flex justify-center items-center my-auto uppercase font-200"
                  htmlFor="files"
                >
                  <span className="text-lg">Add photo from your system</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </label>
              </Button>
            </Tooltip>
            <input
              id="files"
              style={{ visibility: "hidden" }}
              className="w-1"
              type="file"
              onChange={(e) => displayImage(e)}
            />
          </div>
        )}
      </div>

      <div
        className={`${
          activeStep !== 2 && "hidden"
        } flex justify-center flex-col items-center my-5 font-200 uppercase`}
      >
        <label className="uppercase">Add a topic</label>
        <input
          onKeyDown={handleCustomTag}
          name="customTag"
          type="text"
          autoComplete="off"
          maxLength={20}
          disabled={selectedTags.length >= 3}
          className="border-black my-1"
        />
        <div className="flex gap-x-4 my-2 justify-center flex-wrap">
          {customTag.map((tag, index) => (
            <Chip
              variant="ghost"
              key={index}
              icon={<Icon index={index} />}
              value={tag}
              className="cursor-pointer hover:scale-105"
            ></Chip>
          ))}
        </div>
        <span className="text-md font-semibold mt-5">Select tags</span>
        <div className="flex flex-wrap mx-28 justify-center gap-x-8 gap-y-5 mt-5">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              variant="outlined"
              value={tag}
              onClick={() => handleChipClick(tag)}
              className={`rounded-full lowercase capitalize text-md hover:text-black font-200 cursor-pointer font-normal ${
                selectedTags.includes(tag) && "bg-gray-300 text-black"
              }`}
            />
          ))}
        </div>
        <span className="my-10 font-semibold">
          You can select upto 3 tags&nbsp;
          <span className="border-b-2 border-gray-700">
            ({3 - post.tags.length} out of 3 available)
          </span>
        </span>
        <Button
          loading={loading}
          onClick={handleClick}
          className="rounded-full flex items-center group"
        >
          Publish
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:scale-110 duration-300 transform-gpu"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
        {error && <span className="mt-3 text-red-500">{error}</span>}
      </div>

      <div className="w-1/2 py-4 px-8">
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          <Step className="h-4 w-4" onClick={() => setActiveStep(0)} />
          <Step className="h-4 w-4" onClick={() => setActiveStep(1)} />
          <Step className="h-4 w-4" onClick={() => setActiveStep(2)} />
        </Stepper>
        <div className="mt-16 flex justify-between">
          <Button
            onClick={handlePrev}
            variant="outlined"
            disabled={isFirstStep}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isLastStep}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Compose;
