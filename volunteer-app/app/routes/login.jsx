import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

// set the browser tab title
export function meta() {
  return [{ title: "Login | Volunteer Hub" }];
}

export default function Login() {
  // store the email entered by the volunteer
  const [email, setEmail] = useState("");

  // store the password entered by the volunteer
  const [password, setPassword] = useState("");

  // control whether the password field is visible
  const [showPassword, setShowPassword] = useState(false);

  // store any error message returned by supabase
  const [error, setError] = useState("");

  // track whether the login request is running
  const [loading, setLoading] = useState(false);

  // allow us to navigate to another route
  const navigate = useNavigate();

  // continue from the email screen to the password screen
  function handleContinue(event) {
    // stop the browser from refreshing the page
    event.preventDefault();

    // clear any previous error
    setError("");

    // reveal the password field
    setShowPassword(true);
  }

  // log in using the email and password
  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    // ask supabase to authenticate the volunteer
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    // display an error if the credentials are incorrect
    if (error) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    // redirect to Home after successful login
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#F4F9F5] px-6 text-gray-900">
      {/* center the content horizontally and limit its width */}
      <div className="mx-auto max-w-md pt-32">
        {/* reserve the same space for the back button on both screens */}
        <div className="mb-8 h-6">
          {showPassword && (
          <button
           type="button"
            onClick={() => {
              setShowPassword(false);
              setPassword("");
             setError("");
          }}
          className="text-green-900"
        >
          ← Back
      </button>
  )}
</div>

        {/* page heading */}
        <h1 className="text-center text-2xl font-bold text-[#173F30]">
          {showPassword ? "Welcome back!" : "Continue with email"}
        </h1>

        {/* email-first screen */}
        {!showPassword ? (
          <form onSubmit={handleContinue} className="mt-8">
            {/* email input */}
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-green-200 bg-white p-3 outline-none focus:border-green-800"
            />

            {/* helper text from the figma design */}
            <p className="mt-2 text-sm text-gray-500">
              Continue to log in or create an account.
            </p>

            {/* continue button */}
            <button
              type="submit"
              className="mt-9 w-full rounded-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-3 text-lg font-semibold text-white"
            >
              Continue
            </button>
          </form>
        ) : (
          /* password screen for an existing volunteer */
          <form onSubmit={handleLogin} className="mt-8">
            {/* show the email so the volunteer knows which account they're using */}
            <p className="mb-6 text-center text-gray-600">{email}</p>

            {/* password input */}
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-green-200 bg-white p-3 outline-none focus:border-green-800"
            />

            {/* show an error if authentication fails */}
            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* login button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-9 w-full rounded-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-3 text-lg font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* allow the volunteer to change their email */}
            <button
              type="button"
              onClick={() => {
                setShowPassword(false);
                setPassword("");
                setError("");
              }}
              className="mt-6 w-full text-center text-gray-600"
            >
              ← Change email address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
