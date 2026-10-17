import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("opportunities", "routes/opportunities.jsx"),
  route("opportunities/:opportunityId", "routes/opportunity-details.jsx"),
  route("saved", "routes/saved.jsx"),
  route("signup", "routes/signup.jsx"),
  route("login", "routes/login.jsx"),
  route("my-activities", "routes/my-activities.jsx"),
];