/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import { GenerateIcon } from "./icons";
import Spinner from "./Spinner";
import {
  getContributionsData,
  getLanguagesData,
  getUserData,
} from "../fetcher";

const Credentials = ({ updateStates }) => {
  const [userData, setUserData] = useState();
  const [languagesData, setLanguagesData] = useState();
  const [contributionsData, setContributionsData] = useState();
  const [spinner, setSpinner] = useState(false);
  const [formError, setFormError] = useState(false);
  const [fetchError, setFetchError] = useState();
  const loginRef = useRef();
  const tokenRef = useRef();

  const errorMessage = "An error occured. Check if your credentials are correct.";

  const fetchData = async () => {
    const userObject = await getUserData(
      loginRef.current.value,
      tokenRef.current.value
    );
    if (userObject.errorMessage) {
      setFetchError(errorMessage);
      console.log(userObject.errorMessage);
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
      setFetchError(errorMessage);
      console.log(languagesObject.errorMessage);
      return;
    }
    setLanguagesData(languagesObject.data);

    const contributionsObject = await getContributionsData(
      loginRef.current.value,
      tokenRef.current.value,
      creationYear
    );
    if (contributionsObject.errorMessage) {
      setFetchError(errorMessage);
      console.log(contributionsObject.errorMessage);
      return;
    }
    setContributionsData(contributionsObject.data);
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
    setSpinner(true);
    setFetchError();
    fetchData();
  };

  useEffect(() => {
    if (userData && languagesData && contributionsData) {
      updateStates(userData, languagesData, contributionsData);
    }
  });

  return (
    <>
      <h3>Enter your credentials below</h3>
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

      {formError && (
        <div className="error">You forgot your login and/or token!</div>
      )}

      {!(languagesData && contributionsData) && userData && (
        <div className="btn-stats spinnerWrapper">
          <Spinner spinner={spinner} />
        </div>
      )}

      {userData && (
        <>
          <strong>Hello {userData.name}!</strong>
          <br />
          Please wait, your stats are being fetched... It may take a while
          depending on the number of your repositories and contributions.
          <br />
          {!languagesData && <div>Fetching languages data...</div>}
          {languagesData && (
            <div className="fetched">Languages data fetched correctly!</div>
          )}
          {!contributionsData && <div>Fetching contributions data...</div>}
          {contributionsData && (
            <div className="fetched">Contributions data fetched correctly!</div>
          )}
        </>
      )}

      {fetchError && <div className="error">{fetchError}</div>}
    </>
  );
};

export default Credentials;
