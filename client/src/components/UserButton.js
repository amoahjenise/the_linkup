import { useDispatch } from "react-redux";
import { SignOutButton, useClerk, useUser } from "@clerk/clerk-react";
import { setCurrentUser } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";

const CustomUserButton = ({ onSignOut, ...rest }) => {
  const dispatch = useDispatch();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (isSignedIn) {
      // Perform the actual sign-out using Clerk's signOut function
      await signOut();

      dispatch(setCurrentUser({}));

      navigate("/");

      // // Trigger the onSignOut callback passed from the parent component
      // onSignOut();
    }
  };

  return (
    <div>
      {/* Pass the handleSignOut function directly to the SignOutButton component */}
      {/* <SignOutButton signOutCallback={handleSignOut}> */}
      <button onClick={handleSignOut}>Sign Out</button>
      {/* </SignOutButton> */}
    </div>
  );
};

export default CustomUserButton;
