import { useParams } from "react-router";

export default function OpportunityDetails() {
  const { opportunityId } = useParams();
  // params lets us read id in the url, for example opportunity/3 etc
  return <h1>Opportunity ID: {opportunityId}</h1>;
}
