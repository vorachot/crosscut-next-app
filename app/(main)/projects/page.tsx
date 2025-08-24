import ProjectList from "@/components/project-list";

const page = async () => {
  return (
    <div className="flex flex-col justify-center gap-7">
      <h1 className="text-5xl">Your Projects</h1>
      <div className="h-full">
        <ProjectList />
      </div>
    </div>
  );
};

export default page;
