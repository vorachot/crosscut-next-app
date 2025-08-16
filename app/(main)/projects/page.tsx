import ProjectList from "@/components/project-list";

const page = async () => {
  return (
    <div className="flex flex-col justify-center gap-5">
      <h1 className="text-5xl">Your Projects</h1>
      <ProjectList />
    </div>
  );
};

export default page;
