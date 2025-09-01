"use client";

import { Chip } from "@heroui/chip";

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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Resource Pools
        </h2>
        <Chip color="primary" size="sm" variant="flat">
          {rows.length} pools
        </Chip>
      </div>
      <ResourceTableClient
        columns={columns}
        pathTemplate="namespace-to-resourcepool"
        rows={rows}
      />
    </div>
  );
};

export default ResourcePoolList;
