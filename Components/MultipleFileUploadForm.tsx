import Image from "next/image";
import { ChangeEvent, useState } from "react";

const MultipleFileUploadForm = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onFilesUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      alert("No files were chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    /** Files validation */
    const validFiles: File[] = [];
    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];

      if (!file.type.startsWith("image")) {
        alert(`File with idx: ${i} is invalid`);
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) {
      alert("No valid files were chosen");
      return;
    }

    /** Uploading files to the server */
    try {
      var formData = new FormData();
      validFiles.forEach((file) => formData.append("media", file));

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
        alert(error || "Sorry! something went wrong.");
        return;
      }

      setPreviewUrls(
        validFiles.map((validFile) => URL.createObjectURL(validFile))
      );

      /** Reset file input */
      fileInput.type = "text";
      fileInput.type = "file";

      console.log("Files were uploaded successfully:", data);
    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
    }
  };

  return (
    <form
      className="w-full p-3 border border-gray-500 border-dashed"
      onSubmit={(e) => e.preventDefault()}
    >
      {previewUrls.length > 0 ? (
        <>
          <button
            onClick={() => setPreviewUrls([])}
            className="mb-3 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-gray-900"
          >
            Clear Previews
          </button>

          <div className="flex flex-wrap justify-start">
            {previewUrls.map((previewUrl, idx) => (
              <div key={idx} className="w-full p-1.5 md:w-1/2">
                <Image
                  alt="file uploader preview"
                  objectFit="cover"
                  src={previewUrl}
                  width={320}
                  height={218}
                  layout="responsive"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <label>
          <strong>Select images</strong>
          <input
            name="file"
            type="file"
            onChange={onFilesUploadChange}
            multiple
          />
        </label>
      )}
    </form>
  );
};

export default MultipleFileUploadForm;
