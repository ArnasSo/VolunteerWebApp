import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("activities", "routes/activities.jsx"),
  route("activities/:activityId", "routes/activity-details.jsx"),
  route("saved", "routes/saved.jsx"),
  route("signup", "routes/signup.jsx"),
  route("login", "routes/login.jsx"),
  route("my-activities", "routes/my-activities.jsx"),
  route("profile", "routes/profile.jsx"),
];