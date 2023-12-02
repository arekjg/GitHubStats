/* eslint-disable react/prop-types */

import { useRef, useState } from "react";

import {
  getContributionsData,
  getLanguagesData,
  getUserData,
} from "../fetcher";
import Spinner from "./Spinner";
import Popup from "./popup";
import { DisplayIcon, GenerateIcon } from "./icons";

const Content = () => {
  const [userData, setUserData] = useState();
  const [languagesData, setLanguagesData] = useState();
  const [contributionsData, setContributionsData] = useState();
  const [spinner, setSpinner] = useState(false);
  const [formError, setFormError] = useState(false);
  const loginRef = useRef();
  const tokenRef = useRef();

  const [displayStats, setDisplayStats] = useState(false);

  const showStats = () => {
    if (displayStats) {
      setUserData();
      setLanguagesData();
      setContributionsData();
      setSpinner(false);
    }
    setDisplayStats(!displayStats);
  };

  const generateStats = async (e) => {
    e.preventDefault();
    if (
      loginRef.current.value.length === 0 ||
      tokenRef.current.value.length === 0
    ) {
      setFormError(true);
      return;
    }
    setFormError(false);
    setSpinner(true);

    const fetchData = async () => {
      const userObject = await getUserData(
        loginRef.current.value,
        tokenRef.current.value
      );
      if (userObject.errorMessage) {
        console.log("user - error");
        console.log(userObject.errorMessage);
        alert(`user - error\n${userObject.errorMessage}`);
        return;
      }
      setUserData(userObject.data);

      let creationYear = new Date(
        Date.parse(userObject.data.created_at)
      ).getFullYear();

      const languagesObject = await getLanguagesData(
        loginRef.current.value,
        tokenRef.current.value
      );
      if (languagesObject.errorMessage) {
        console.log("languages - error");
        console.log(languagesObject.errorMessage);
        alert(`languages - error\n${languagesObject.errorMessage}`);
        return;
      }
      setLanguagesData(languagesObject.data);

      const contributionsObject = await getContributionsData(
        loginRef.current.value,
        tokenRef.current.value,
        creationYear
      );
      if (contributionsObject.errorMessage) {
        console.log("contributions - error");
        console.log(contributionsObject.errorMessage);
        alert(`contributions - error\n${contributionsObject.errorMessage}`);
        return;
      }
      setContributionsData(contributionsObject.data);
    };
    fetchData();
  };

  return (
    <>
      <h2>Enter your credentials below</h2>
      <form>
        <div>
          Login&ensp;
          <input
            type="text"
            ref={loginRef}
            placeholder="Enter login here..."
            autoComplete="on"
          ></input>
        </div>
        <div>
          Token&ensp;
          <input
            type="password"
            ref={tokenRef}
            placeholder="Enter token here..."
            autoComplete="on"
          ></input>
        </div>
      </form>
      <br />
      <div className="btn btn-stats" onClick={generateStats}>
        <GenerateIcon />
        generate stats
      </div>

      {formError && <div className="error">You forgot your login and/or token!</div>}

      {!(languagesData && contributionsData) && userData && (
        <div className="btn-stats spinnerWrapper">
          <Spinner spinner={spinner} />
        </div>
      )}

      {userData && (
        <>
          <div>
            <strong>Hello {userData.name}!</strong>
            <br />
            Please wait, your stats are being fetched... It may take a while
            depending on the number of your repositories and contributions.
          </div>
          <br />
          <div>
            {!languagesData && <div>Fetching languages data...</div>}
            {languagesData && <div>Languages data fetched correctly!</div>}
            {!contributionsData && <div>Fetching contributions data...</div>}
            {contributionsData && (
              <div>Contributions data fetched correctly!</div>
            )}
          </div>
          <br />

          {languagesData && contributionsData && (
            <>
              Click here to display your stats:
              <br />
              <br />
              <div className="btn btn-stats" onClick={showStats}>
                <DisplayIcon />
              </div>
            </>
          )}
        </>
      )}

      {displayStats && (
        <Popup
          userData={userData}
          languagesData={languagesData}
          contributionsData={contributionsData}
          handleClose={showStats}
        />
      )}
    </>
  );
};

export default Content;
