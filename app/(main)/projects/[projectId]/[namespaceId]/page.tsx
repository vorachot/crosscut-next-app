import ResourceCard from "@/components/resource-card";
import ResourceTableClient from "@/components/resource-table-client";

const page = async ({
  params,
}: {
  params: { projectId: string; namespaceId: string };
}) => {
  const { projectId, namespaceId } = await params;

  const columns = [
    { name: "RESOURCE POOL", uid: "name", sortable: true },
    { name: "CREATED", uid: "created", sortable: true },
    { name: "RESOURCE USAGE", uid: "usage", sortable: true },
  ];
  const rows = [
    {
      projectId: "project-1",
      namespaceId: "namespace-1",
      resourcePoolId: "resource-pool-1",
      name: "Group 1",
      created: "01 Jan 2023",
      usage: { cpu: 2, gpu: 2, memory: 4 },
    },
    {
      projectId: "project-1",
      namespaceId: "namespace-2",
      resourcePoolId: "resource-pool-2",
      name: "Group 2",
      created: "01 Jan 2023",
      usage: { cpu: 2, gpu: 1, memory: 2 },
    },
  ];

  return (
    <div className="flex flex-col justify-center gap-6">
      <div className="flex flex-col items-start gap-2">
        <div className="text-4xl">Project: {projectId}</div>
        <div className="text-4xl">Namespace: {namespaceId}</div>
        <div className="text-gray-500">Created: 01 Jan 2023</div>
      </div>
      <ResourceCard />
      <div className="flex flex-col items-start gap-2">
        <div className="text-3xl">Resource Pools</div>
      </div>
      <ResourceTableClient
        columns={columns}
        pathTemplate="namespace-to-resourcepool"
        rows={rows}
      />
    </div>
  );
};

export default page;
