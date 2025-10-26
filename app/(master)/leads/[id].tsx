import { useLocalSearchParams } from "expo-router";
import { SingleLeadView } from "@/modules/master/leads/ui/views/SingleLeadView";

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <SingleLeadView leadId={id} />;
}
