"use client";

import React, { useEffect, useState } from "react";
import useGetCalls from "@/hooks/useGetCalls";
import { useRouter } from "next/navigation";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

interface CallListProps {
  type: "ended" | "upcoming" | "recording";
}

const CallList: React.FC<CallListProps> = (props) => {
  const { type } = props;
  const { endedCalls, isLoading, callRecordings, upcomingCalls } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recording":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recording":
        return "No Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Try again letter" });
      }
    };

    if (type === "recording") fetchRecordings();
  }, [type, callRecordings, toast]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call)?.id}
            date={
              (meeting as Call).state?.startedAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            handleClick={
              type === "recording"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`meeting/${(meeting as Call).id}`)
            }
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            link={
              type === "recording"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 20) ||
              (meeting as CallRecording)?.filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            buttonIcon1={type === "recording" ? "/icons/play.svg" : undefined}
            buttonText={type === "recording" ? "Play" : "Start"}
            isPreviousMeeting={type === "ended"}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
