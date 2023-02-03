import type { NextPage } from "next";
import Head from "next/head";
import MultipleFileUploadForm from "../../Components/MultipleFileUploadForm";
import SingleFileUploadForm from "../../Components/SingleUploadForm";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>File uploader</title>
        <meta name="description" content="File uploader" />
      </Head>

      <main className="py-10">
        <div>
          <h1>Upload your files</h1>

          <div className="space-y-10">
            <div>
              <h2>Single File Upload Form</h2>
              <SingleFileUploadForm />
            </div>
            <div>
              <h2>Multiple File Upload Form</h2>
              <MultipleFileUploadForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
