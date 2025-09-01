import ProjectList from "@/components/project-list";

const page = async () => {
  return (
    <div className="flex flex-col justify-center gap-7">
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
        Your Projects
      </h1>
      <div className="h-full">
        <ProjectList />
      </div>
    </div>
  );
};

export default page;
