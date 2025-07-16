import InfoCard from "@/components/info-card";

const page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col justify-center gap-10">
      <h1 className="text-5xl">Your Projects</h1>
      <div className="flex flex-row flex-wrap gap-10">
        <InfoCard createdDate="30 Nov 2027" id="1" title="Image Processing" />
        <InfoCard createdDate="02 Jan 2023" id="2" title="Untitled" />
        <InfoCard createdDate="28 Dec 2028" id="4" title="Default" />
      </div>
    </div>
  );
};

export default page;
