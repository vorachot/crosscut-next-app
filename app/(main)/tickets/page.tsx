import AddIcon from "@mui/icons-material/Add";

import ButtonClient from "@/components/button-client";
import TicketTableClient from "@/components/ticket-table-client";

const page = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-5xl">Your Tickets</h1>
        <div className="flex items-center">
          <ButtonClient>
            <AddIcon />
            Ticket
          </ButtonClient>
        </div>
      </div>
      <TicketTableClient pathTemplate="resourcepool-to-ticket" />
    </div>
  );
};

export default page;
