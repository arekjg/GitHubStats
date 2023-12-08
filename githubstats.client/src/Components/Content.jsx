import { useState } from "react";

import Statistics from "./Statistics";
import Credentials from "./Credentials";

const Content = () => {
  const [userData, setUserData] = useState();
  const [languagesData, setLanguagesData] = useState();
  const [contributionsData, setContributionsData] = useState();
  const [displayStats, setDisplayStats] = useState(false);

  const updateStates = (userData, languagesData, contributionsData) => {
    if (userData && languagesData && contributionsData) {
      setUserData(userData);
      setLanguagesData(languagesData);
      setContributionsData(contributionsData);
    }
    setDisplayStats(true);
  };

  return (
    <>
      {!displayStats && <Credentials updateStates={updateStates} />}

      {displayStats && (
        <Statistics
          userData={userData}
          languagesData={languagesData}
          contributionsData={contributionsData}
        />
      )}
    </>
  );
};

export default Content;
