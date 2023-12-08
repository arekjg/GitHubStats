/* eslint-disable react/prop-types */

import LanguagesChart from "./LanguagesChart";

const Statistics = ({ userData, languagesData, contributionsData }) => {
  const renderTotal = () => {
    let total = 0;
    contributionsData.forEach((el) => {
      total +=
        el.data.user.contributionsCollection.contributionCalendar
          .totalContributions;
    });
    return <div>Total contributions: {total}</div>;
  };

  const renderContributions = () => {
    return contributionsData.map((c) => (
      <div
        key={c.data.user.contributionsCollection.contributionCalendar.weeks[0].firstDay.slice(
          0,
          4
        )}
        id={c.data.user.contributionsCollection.contributionCalendar.weeks[0].firstDay.slice(
          0,
          4
        )}
      >
        Contributions in{" "}
        {c.data.user.contributionsCollection.contributionCalendar.weeks[0].firstDay.slice(
          0,
          4
        )}
        :{" "}
        {
          c.data.user.contributionsCollection.contributionCalendar
            .totalContributions
        }
      </div>
    ));
  };

  const renderCreationDate = () => {
    let ms = Date.parse(userData.created_at);
    let creationDate = new Date(ms);
    return <div>On GtHub since: {creationDate.toLocaleString()}</div>;
  };

  return (
    <>
      <h3>Your GitHub statistics</h3>
      <div>
        Name: {userData.name}
        <br />
        Username: {userData.login}
        <br />
        {userData.created_at && renderCreationDate()}
        <br />
        Number of repositories:{" "}
        {userData.public_repos + userData.owned_private_repos} (
        {userData.public_repos} public / {userData.owned_private_repos} private)
        <br />
        <br />
        {contributionsData && renderContributions()}
        {contributionsData && renderTotal()}
      </div>
      <br />
      <LanguagesChart
        title="Programming Languages"
        languagesData={{ languagesData }}
      />
    </>
  );
};

export default Statistics;
