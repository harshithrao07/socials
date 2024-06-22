import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { getBlog, scrollToTop, updateBlog } from "../../helper"; // Replace with actual API functions
import { Button, Tooltip } from "@material-tailwind/react";

const EditBlogPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [image, setImage] = useState(null);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [fileImage, setFileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const S3_BUCKET = "socialsbucket";
  const REGION = "ap-south-1";

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getBlog(id);
        setTitle(response.data.title);
        setEditorHtml(response.data.content);
        setTags(response.data.tags);
        setImage(response.data.imagePreview);
        if (quillInstance.current) {
          quillInstance.current.clipboard.dangerouslyPasteHTML(
            response.data.content
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPost();
  }, [id]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const imageHandler = () => {
    const quill = quillInstance.current;
    console.log("Quill instance inside imageHandler:", quill);
    if (!quill) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const extension = file.name.split(".").pop();
          let name = file.name.split(".")[0];
          name = name.replace(/\s+/g, ""); // Remove all white spaces

          const key = `${uuidv4()}${name}.${extension}`;
          const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

          // S3 Credentials
          AWS.config.update({
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
          });

          // File Parameters
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
            const range = quill.getSelection(true);
            console.log("Selection range:", range);
            if (range) {
              quill.insertEmbed(range.index, "image", imageUrl);
              quill.setSelection(range.index + 1);

              // Update post content immediately after inserting image
              const content = quill.root.innerHTML.trim();
              setEditorHtml(content);
            } else {
              console.error("Could not retrieve the selection range.");
            }
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        } catch (err) {
          console.log("Storage err:", err);
        }
      }
    };
  };

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              ["link", "image", "blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
              [{ color: [] }, { background: [] }],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
      });

      quillInstance.current.on("text-change", () => {
        setEditorHtml(quillInstance.current.root.innerHTML);
      });

      // Set initial content if available
      if (editorHtml) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(editorHtml);
      }
    }
  }, [editorHtml]);

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCustomTag = (e) => {
    if (e.key === "Enter") {
      const { value } = e.target;
      if (value.trim() !== "" && !tags.includes(value) && tags.length < 3) {
        setTags([...tags, value]);
      }
      setCustomTag("");
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      let imageUrl;
      if (image) {
        imageUrl = await handleImageUpload();
      }

      const res = await updateBlog({
        id,
        title,
        content: editorHtml,
        tags,
        imagePreview: imageUrl,
      });

      if (res.status == 200) [navigate(`/blogs/${res.data.id}`)];
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading(true);
    }
  };

  const handleImageUpload = async () => {
    if (fileImage) {
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

  return (
    <div className="my-14 mx-4 lg:mx-20">
      <div className="flex flex-col items-center font-300">
        <span className="text-2xl md:text-4xl font-semibold text-gray-900 text-center mb-6">
          Edit Blog
        </span>
        <div className="flex flex-col justify-center items-center">
          <label className="uppercase">
            Change your topic (You can only select up to 3 tags)
          </label>
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={handleCustomTag}
            name="customTag"
            type="text"
            autoComplete="off"
            maxLength={20}
            disabled={tags.length >= 3}
            className="border-black my-1"
          />
          <span className="text-md font-semibold mt-5 underline">
            Current tags
          </span>
          <div className="flex flex-wrap md:mx-28 justify-center gap-x-8 gap-y-5 mt-5 w-full">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="border rounded-full px-4 py-1 text-md font-200 cursor-pointer bg-gray-200 flex items-center"
                >
                  {tag}
                  <span
                    className="ml-2 cursor-pointer text-red-500"
                    onClick={() => handleTagRemove(tag)}
                  >
                    x
                  </span>
                </div>
              ))
            ) : (
              <span className="italic">You have not defined any tags yet.</span>
            )}
          </div>
        </div>
        <div className="w-full mb-10">
          <input
            value={title}
            onChange={handleChange}
            name="title"
            type="text"
            placeholder="Title"
            className="border-none text-4xl mb-4 outline-none py-3 px-5 blog-input w-full"
          />
          <div ref={quillRef} className="h-96 text-md font-100" />
        </div>
        <div className="flex justify-center items-center flex-col font-300">
          <span className="text-xl">Story Preview:</span>
          {image && (
            <div className="flex justify-center">
              <img src={image} alt="uploaded image" className="my-5 w-1/2" />
            </div>
          )}

          {
            <div className="flex flex-col justify-center items-center text-gray-600">
              <Tooltip content="Your preview image" placement="bottom">
                <Button
                  variant="outlined"
                  className="rounded-full outline-none py-2.5 px-3 scale-75 md:scale-100"
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
          }
        </div>
        <Button loading={loading} onClick={saveChanges}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditBlogPage;
