import { createColumnHelper } from "@tanstack/react-table";
import Table from "../components/Table";
import type { Command, CommandHistory } from "../utils/types";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useState, useEffect } from "react";

const columnHelper = createColumnHelper<CommandHistory>();

const API_DOMAIN = "http://localhost:8001"

const columns = [
  columnHelper.accessor("command_id",{
    header: "Command ID"
  }),
  columnHelper.accessor("status",{
    header: "Status"
  }),
  columnHelper.accessor("params",{
    header: "Parameters"
  }),
  columnHelper.accessor("created_at",{
    header: "Created at"
  }),
];

/**
 * @brief CommandHistory component displaying the audit log table
 * @return tsx element of CommandHistory component
 */
function CommandHistoryPage() {
  // The page must provide a way for the user to select which command's audit log they want to view.
  // The selected command should determine which command history is fetched.
  // The table should communicate that this is an audit log.
  // The table should be centred on the page.
  const [commandId, setCommandId] = useState("");

  const [allCommands, setAllCommands] = useState<Command[]>([]);

  useEffect(() => {
    async function getCommands() {
      const response = await fetch(API_DOMAIN + "/api/commands/");
      if (!response.ok) {
        throw new Error("Commands couldn't be fetched.");
      }
      const json = await response.json();
      setAllCommands(json.data);
    }
    getCommands();
  }, []);

  const { data, isLoading, isError } = useCommandHistory(commandId);
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl">Command Audit Log</h1>
      { isLoading && <p className="text-blue-400">Loading audit log...</p> }
      { isError && <p className="text-red-500">Error loading audit log</p>}
      <select
        value={commandId}
        onChange={(e) => setCommandId(e.target.value)}
        className="w-full max-w-5xl flex-1 bg-input text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-ring"
      >
        <option value="">Choose a command</option>
        {allCommands?.map((cmd) => (
          <option key={cmd.id} value={cmd.id}>
            {cmd.id} ({cmd.status})
          </option>
        ))}
      </select>
      <Table data={data ?? []} columns={columns}/>
    </div>
  )
}

export default CommandHistoryPage;
