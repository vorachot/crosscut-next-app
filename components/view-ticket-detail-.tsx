import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { useState } from "react";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { toast, Toaster } from "react-hot-toast";

type ViewTicketDetailProps = {
  setOnClose?: () => void;
  open: boolean;
  url?: string;
  password?: string;
};
const ViewTicketDetail = ({
  setOnClose,
  open,
  url,
  password,
}: ViewTicketDetailProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        toast.success("Password copied to clipboard!");
        setCopied(true);
      } catch (err) {
        toast.error("Failed to copy password. Please try again: " + err);
      }
    }
  };

  const handleOnclose = () => {
    if (setOnClose) setOnClose();
    setCopied(false);
  };

  if (!open) return null;

  return (
    <>
      <Toaster />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-[400px] px-5 py-5 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 relative">
          <Button
            className="absolute top-2 right-2 min-w-8 h-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
            onPress={handleOnclose}
          >
            ✕
          </Button>
          <div className="flex flex-col items-center gap-5">
            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
              Ticket Detail
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-left w-full">
              {url ? (
                <>
                  <div className="mb-2">
                    Code Server:{" "}
                    <a
                      className="text-blue-600 dark:text-blue-400 underline"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Click Here
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    Password:
                    <span
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="font-mono cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded"
                      role="button"
                      tabIndex={0}
                      onClick={() => setShowPassword(!showPassword)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }
                      }}
                    >
                      {showPassword ? password : "••••••••"}
                    </span>
                    <Button
                      className="min-w-8 h-6 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      size="sm"
                      title={copied ? "Copied!" : "Copy password"}
                      variant="light"
                      onPress={handleCopyPassword}
                    >
                      {copied ? (
                        "✓"
                      ) : (
                        <ContentCopyRoundedIcon className="!w-5 !h-5" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                "No URL available"
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ViewTicketDetail;
