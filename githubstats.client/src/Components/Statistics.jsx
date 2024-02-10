/* eslint-disable react/prop-types */

import ContributionsChart from "./ContributionsChart";
import LanguagesChart from "./LanguagesChart";
import ReposChart from "./ReposChart";

const Statistics = ({ userData, languagesData, contributionsData }) => {
  const reposData = [
    { y: userData.public_repos, name: "public", color: "#9ed22d" },
    { y: userData.owned_private_repos, name: "private", color: "#9186ea" },
  ];

  const totalContrData = [];
  contributionsData.forEach((c) => {
    totalContrData.push({
      label:
        c.data.user.contributionsCollection.contributionCalendar.weeks[0].firstDay.slice(
          0,
          4
        ),
      y: c.data.user.contributionsCollection.contributionCalendar
        .totalContributions,
      indexLabel:
        c.data.user.contributionsCollection.contributionCalendar.totalContributions.toString(),
      color: "#30a14e",
    });
  });

  const totalContr = () => {
    let total = 0;
    contributionsData.forEach((el) => {
      total +=
        el.data.user.contributionsCollection.contributionCalendar
          .totalContributions;
    });
    return total;
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
      </div>
      <br />
      <div>
        <ReposChart
          title={`Repositories: ${
            userData.public_repos + userData.owned_private_repos
          }`}
          reposData={{ reposData }}
        />
        <ContributionsChart
          title={`Contributions: ${totalContr()}`}
          totalContrData={{ totalContrData }}
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
