import React from "react";

const Landing = ({ fetchUser, fetchUserThunk }) => {
  const [useThunk, setUseThunk] = React.useState(true);
  return (
    <div>
      <button onClick={useThunk ? fetchUserThunk : fetchUser}>
        fetch User
      </button>
      <input
        type="checkbox"
        onChange={() => {
          setUseThunk(!useThunk);
        }}
        checked={useThunk}
      />
      <span>use Thunk</span>
    </div>
  );
};

export default Landing;
