// import { useSignUp } from "@clerk/clerk-react";
// import { useState } from "react";
// import { SignUp } from "@clerk/clerk-react";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// }));

// export default function ClerkCustomSignUp() {
//   const classes = useStyles();

//   const { isLoaded, signUp, setActive } = useSignUp();

//   if (!isLoaded) {
//     // handle loading state
//     return null;
//   }

//   async function submit(e) {
//     e.preventDefault();
//     // Check the sign up response to
//     // decide what to do next.
//     await signUp
//       .create({
//         emailAddress,
//         password,
//       })
//       .then((result) => {
//         if (result.status === "complete") {
//           console.log(result);
//           setActive({ session: result.createdSessionId });
//         } else {
//           console.log(result);
//         }
//       })
//       .catch((err) => console.error("error", err.errors[0].longMessage));
//   }

//   return (
//     <div className={classes.root}>
//       <SignUp afterSignUpUrl={"/registration"}   />
//     </div>
//   );
// }

import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ClerkCustomSignUp() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SignUp redirectUrl={"/registration"} />
    </div>
  );
}
