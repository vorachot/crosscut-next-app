import ResourceCard from "@/components/resource-card";
import ResourcePoolList from "@/components/resource-pool-list";

const page = async ({
  params,
}: {
  params: { projectId: string; namespaceId: string };
}) => {
  const { projectId, namespaceId } = await params;

  return (
    <div className="flex flex-col justify-center gap-6">
      <div className="flex flex-col items-start gap-2">
        <div className="text-4xl">Project: {projectId}</div>
        <div className="text-4xl">Namespace: {namespaceId}</div>
        <div className="text-gray-500">Created: 01 Jan 2023</div>
      </div>
      <ResourceCard />
      <ResourcePoolList />
    </div>
  );
};

export default page;
