import React from "react";
import InfoCard from "../components/InfoCard";
import ScreenShell from "../components/ScreenShell";

export default function HomeScreen({
  mood,
  nextEvent,
  medicationTakenCount,
  medicationTotal,
  urgentMedications,
  completedEvents,
  totalEvents,
  latestFamilyUpdate,
}) {
  const familyAuthor = latestFamilyUpdate ? latestFamilyUpdate.author : "Family";
  const familyMessage = latestFamilyUpdate
    ? latestFamilyUpdate.message
    : "No family update posted yet.";
  const nextEventLabel = nextEvent ? `${nextEvent.time} - ${nextEvent.title}` : "No events scheduled";

  return (
    <ScreenShell title="Home">
      <InfoCard
        label="Medication status"
        value={`${medicationTakenCount}/${medicationTotal} logged`}
        tone={medicationTakenCount === medicationTotal ? "success" : "warning"}
      />
      <InfoCard label="Next event" value={nextEventLabel} />
      <InfoCard
        label="Today completion"
        value={`${completedEvents}/${totalEvents} activities done`}
      />
      <InfoCard label="Current mood" value={mood} />
      <InfoCard
        label="Pending medications"
        value={String(urgentMedications)}
        tone={urgentMedications > 0 ? "warning" : "success"}
      />
      <InfoCard
        label={`Latest family update (${familyAuthor})`}
        value={familyMessage}
      />
    </ScreenShell>
  );
}
