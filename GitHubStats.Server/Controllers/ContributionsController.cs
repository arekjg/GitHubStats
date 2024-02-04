using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace GitHubStats
{
    [ApiController]
    [Route("[controller]")]
    public class ContributionsController : ControllerBase
    {
        [HttpGet]
        public List<ContributionsRoot>? GetReposData(string login, string token, int creationYear)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
                    client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
                    client.DefaultRequestHeaders.Add("User-Agent", $"{login}");
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                    client.BaseAddress = new Uri("https://api.github.com/graphql");

                    var dict = new Dictionary<string, string>
                    {
                        { "login", $"{login}" }
                    };

                    var years = new List<int>();
                    for (int i = creationYear; i <= DateTime.Now.Year; i++)
                    {
                        years.Add(i);
                    }

                    var contributions = new List<ContributionsRoot>();
                    // contributionsCollection (date from - date to)
                    // example:
                    // contributionsCollection(from:""2020-05-05T00:00:00Z"", to:""2020-05-05T00:00:00Z"") {
                    foreach (int year in years)
                    {
                        var queryObject = new
                        {
                            query = @"query ($login: String!) {
                                        user(login: $login) {
                                            name
                                            contributionsCollection(from:""" + year.ToString() + @"-01-01T00:00:00Z"", to:""" + year.ToString() + @"-12-31T00:00:00Z"") {
                                                contributionCalendar {
                                                    colors
                                                    totalContributions
                                                    weeks {
                                                        contributionDays {
                                                            color
                                                            contributionCount
                                                            date
                                                            weekday
                                                        }
                                                        firstDay
                                                    }
                                                }
                                            }
                                        }
                                    }",
                            variables = dict
                        };

                        var request = new HttpRequestMessage()
                        {
                            Method = HttpMethod.Post,
                            Content = new StringContent(JsonConvert.SerializeObject(queryObject), Encoding.UTF8, "application/json")
                        };

                        ContributionsRoot? responseObj;
                        string responseBody = "";

                        using (var response = client.SendAsync(request).Result)
                        {
                            response.EnsureSuccessStatusCode();
                            responseBody = response.Content.ReadAsStringAsync().Result;
                            responseObj = JsonConvert.DeserializeObject<ContributionsRoot>(responseBody);
                        }
                        if (responseObj == null)
                        {
                            continue;
                        }
                        contributions.Add(responseObj);
                    }
                    return contributions;
                }
            }
            catch
            {
                return null;
            }
        }
    }
}