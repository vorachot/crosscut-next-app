import InfoCard from "@/components/info-card";
import NamespaceList from "@/components/namespace-list";
import ResourceCard from "@/components/resource-card";
import { formatDate } from "@/utils/helper";

const page = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col justify-center gap-7">
      <div className="flex gap-5">
        <InfoCard
          createdAt={formatDate("2022-01-01")}
          name={projectId}
          updatedAt={formatDate("2022-01-02")}
        />
        <ResourceCard />
      </div>

      <NamespaceList projectId={projectId} />
    </div>
  );
};

export default page;
