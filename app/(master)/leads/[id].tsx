import { useLocalSearchParams } from "expo-router";
import { SingleLeadView } from "@/modules/master/leads/ui/views/SingleLeadView";

export default function LeadDetailScreen() {
  const { id: leadId } = useLocalSearchParams<{ id: string }>();

  if (!leadId) {
    return null;
  }

  return <SingleLeadView leadId={leadId} />;
}
