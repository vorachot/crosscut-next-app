import TicketTableClient from "@/components/ticket-table-client";

const page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col justify-center gap-5">
      <h1 className="text-5xl">Your Tickets</h1>
      <TicketTableClient pathTemplate="resourcepool-to-ticket" />
    </div>
  );
};

export default page;
