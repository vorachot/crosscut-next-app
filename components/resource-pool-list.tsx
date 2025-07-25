"use client";

import ResourceTableClient from "./resource-table-client";

const columns = [
  { name: "RESOURCE POOL", uid: "resource_pool", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

const rows = [
  {
    id: "7fd1b94e-f17d-4a07-9802-d635e3b52b3e",
    priority: "3",
    project: "project01",
    quota: "4",
    resource_unit_urn: "rs-2",
    urn: "urn:crosscut:namespace:project01:namespace01",
  },
  {
    id: "f6394f97-0aab-4972-a20f-cb317b76ff37",
    priority: "3",
    project: "project02",
    quota: "4",
    resource_unit_urn: "rs-2",
    urn: "urn:crosscut:namespace:project02:namespace02",
  },
];

const ResourcePoolList = () => {
  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="text-3xl">Resource Pools</div>
      </div>
      <ResourceTableClient
        columns={columns}
        pathTemplate="namespace-to-resourcepool"
        rows={rows}
      />
    </>
  );
};

export default ResourcePoolList;
