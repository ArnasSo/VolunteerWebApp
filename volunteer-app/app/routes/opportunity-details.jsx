import { useParams } from "react-router";

export default function ActivityDetails() {
  const { activityId } = useParams();
  // params lets us read id in the url, for example activity/3 etc
  return <h1>Activity ID: {activityId}</h1>;
}
