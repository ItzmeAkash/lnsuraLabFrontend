import {
  normalizeInsuranceTerminology,
  splitMessageByUrls,
} from "@/lib/parse-message-url";

type ChatMessageTextProps = {
  text: string;
};

export function ChatMessageText({ text }: ChatMessageTextProps) {
  const parts = splitMessageByUrls(normalizeInsuranceTerminology(text));

  return (
    <>
      {parts.map((part, index) =>
        part.type === "url" ? (
          <a
            key={`${part.value}-${index}`}
            href={part.value}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-[#1d70f1] underline underline-offset-2 hover:text-[#1a65db]"
          >
            {part.value}
          </a>
        ) : (
          <span key={`text-${index}`}>{part.value}</span>
        ),
      )}
    </>
  );
}
