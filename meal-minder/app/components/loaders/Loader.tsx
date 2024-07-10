import React from "react";
import { ProgressBar } from "react-loader-spinner";

const Loader = () => {
  return (
    <div>
      <ProgressBar
        visible={true}
        height={80}
        width={100}
        borderColor="#941E1E"
        barColor="#FF904F"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
