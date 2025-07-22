import NamespaceList from "@/components/namespace-list";
import ResourceCard from "@/components/resource-card";

const page = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col justify-center gap-6">
      <div className="flex flex-col items-start gap-2">
        <div className="text-4xl">Project: {projectId}</div>
        <div className="text-gray-500">Created: 01 Jan 2023</div>
      </div>
      <ResourceCard />
      <NamespaceList projectId={projectId} />
    </div>
  );
};

export default page;
