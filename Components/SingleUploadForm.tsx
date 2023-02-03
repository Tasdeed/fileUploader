import Image from "next/image";
import { ChangeEvent, MouseEvent, useState } from "react";

const SingleFileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    const file = fileInput.files[0];

    /** File validation */
    if (!file.type.startsWith("image")) {
      alert("Please select a valid image");
      return;
    }

    /** Setting file state */
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    /** Reset file input */
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";
  };

  const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!previewUrl && !file) {
      return;
    }
    setFile(null);
    setPreviewUrl(null);
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    try {
      var formData = new FormData();
      formData.append("media", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const {
        data,
        error,
      }: {
        data: {
          url: string | string[];
        } | null;
        error: string | null;
      } = await res.json();

      if (error || !data) {
        alert(error || "Something went wrong.");
        return;
      }

      console.log("File was uploaded successfully:", data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <div>
          {previewUrl ? (
            <div className="mx-auto w-80">
              <Image
                alt="file uploader preview"
                objectFit="cover"
                src={previewUrl}
                width={320}
                height={218}
                layout="fixed"
              />
            </div>
          ) : (
            <label>
              <strong>Select an image</strong>
              <input name="file" type="file" onChange={onFileUploadChange} />
            </label>
          )}
        </div>
        <div>
          <button disabled={!previewUrl} onClick={onCancelFile}>
            Cancel file
          </button>
          <button disabled={!previewUrl} onClick={onUploadFile}>
            Upload file
          </button>
        </div>
      </div>
    </form>
  );
};

export default SingleFileUploadForm;
