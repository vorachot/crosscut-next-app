"use client";

import ResourceTableClient from "./resource-table-client";

const columns = [
  { name: "RESOURCE POOL", uid: "resource_pool", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

const rows = [
  {
    id: "default-pool",
    priority: "3",
    project: "project01",
    quota: "4",
    resource_unit_urn: "rs-2",
    urn: "urn:crosscut:namespace:project01:namespace01",
  },
  {
    id: "default-pool-2",
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
