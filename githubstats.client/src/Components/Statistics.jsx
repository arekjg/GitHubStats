/* eslint-disable react/prop-types */

import LanguagesChart from "./LanguagesChart";
import ReposChart from "./ReposChart";

const Statistics = ({ userData, languagesData, contributionsData }) => {
  const reposData = [
    { y: userData.public_repos, name: "public", color: "#9ed22d" },
    { y: userData.owned_private_repos, name: "private", color: "#9186ea" },
  ];
  console.log(reposData);

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
        {contributionsData && renderContributions()}
        {contributionsData && renderTotal()}
      </div>
      <br />
      <div>
        <ReposChart
          title={`Total repositories: ${
            userData.public_repos + userData.owned_private_repos
          }`}
          reposData={{ reposData }}
        />
      </div>
      <br />
      <div>
        <LanguagesChart
          title="Languages on GitHub"
          languagesData={{ languagesData }}
        />
      </div>
    </>
  );
};

export default Statistics;
