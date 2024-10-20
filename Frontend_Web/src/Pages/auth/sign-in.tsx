import { useEffect, useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Toast from "@/components/Toast/Toast";
import { PulseLoader } from "react-spinners";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
    setLoading(true);

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return; // Stop the function if the email is invalid
    }

    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard/home");
      localStorage.setItem("loggedInUser", JSON.stringify({ email }));
      setIsLoggedIn(true);
      Toast("Login Successful!", "success");
    } catch (error) {
      setError("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {error && (
              <Typography variant="small" color="red" className="mt-2">
                {error}
              </Typography>
            )}
          </div>

          {loading ? (
            <Button type="submit" className="mt-6" fullWidth disabled>
              <PulseLoader size={10} color="#ffffff" />
            </Button>
          ) : (
            <Button type="submit" className="mt-6" fullWidth>
              Sign In
            </Button>
          )}
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
