import ResourcePoolList from "@/components/resource-pool-list";
import ResourceCard from "@/components/resource-card";

const page = async ({
  params,
}: {
  params: { projectId: string; namespaceId: string };
}) => {
  const { projectId, namespaceId } = await params;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {namespaceId}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Namespace in project{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {projectId}
            </span>
          </p>
        </div>
      </div>

      {/* Resource Quota Overview */}
      <ResourceCard />

      {/* Resource Pools Section */}
      <ResourcePoolList namespaceId={namespaceId} />
    </div>
  );
};

export default page;
