import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

type Props = {
  transcript: string | null;
};

const VideoTranscript = ({ transcript }: Props) => {
  if (!transcript) {
    return (
      <TabsContent value="Transcript" className="h-[400px]">
        <div className="flex items-center justify-center h-full rounded-xl bg-zinc-900/40 p-6">
          <p className="text-zinc-400">No transcript available</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="Transcript" className="h-[400px]">
      <ScrollArea className="h-full rounded-xl bg-zinc-900/40 p-6">
        <div className="space-y-4">
          {transcript.split("\n").map((paragraph, index) => (
            <p
              key={index}
              className="text-zinc-400 leading-relaxed tracking-wide"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};

export default VideoTranscript;
