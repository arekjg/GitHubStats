const BASE_URL = "https://localhost:7265/";

const fetcher = async (url, login, token, intVariable) => {
  let responseObject = { errorMessage: "", data: null };
  let fullUrl;

  if (!intVariable) {
    fullUrl = `${BASE_URL}${url}?login=${login}&token=${token}`;
  } else if (url === "Languages") {
    fullUrl = `${BASE_URL}${url}?login=${login}&token=${token}&repoCount=${intVariable}`;
  } else if (url === "Contributions") {
    fullUrl = `${BASE_URL}${url}?login=${login}&token=${token}&creationYear=${intVariable}`;
  }

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const responseData = await response.json();
    if (response.status === 204) {
      responseObject.errorMessage =
        "Something went wrong. Status code: 204 - no content. Check your credentials.";
      responseObject.data = responseData;
      return responseObject;
    }
    responseObject.errorMessage = "";
    responseObject.data = responseData;
  } catch (err) {
    responseObject.errorMessage = err;
  }

  return responseObject;
};

export const getUserData = (login, token) => {
  return fetcher("User", login, token);
};

export const getLanguagesData = (login, token, repoCount) => {
  return fetcher("Languages", login, token, repoCount);
};

export const getContributionsData = (login, token, year) => {
  return fetcher("Contributions", login, token, year);
};
