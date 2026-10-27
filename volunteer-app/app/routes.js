
import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),

  // exploring and viewing volunteering opportunities
  route("explore", "routes/explore.jsx"),
  route("explore/results", "routes/explore-results.jsx"),
  route("opportunities/:opportunityId", "routes/opportunity-details.jsx"),

  // volunteer account pages
  route("my-activity", "routes/my-activity.jsx"),
  route("saved", "routes/saved.jsx"),
  route("profile", "routes/profile.jsx"),

  // login and registration
  route("login", "routes/login.jsx"),
  route("signup", "routes/signup.jsx"),
];
