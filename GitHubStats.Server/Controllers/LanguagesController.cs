using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace GitHubStatsApi
{
    [ApiController]
    [Route("[controller]")]
    public class LanguagesController : ControllerBase
    {
        [HttpGet]
        public Dictionary<string, int>? GetLanguagesData(string login, string token)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
                    client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
                    client.DefaultRequestHeaders.Add("User-Agent", $"{login}");
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                    string responseBody = "";
                    HttpResponseMessage response = client.GetAsync("https://api.github.com/user/repos?per_page=100").Result;            // max 100 repos per page, if more - proceed to the nexT page: &page=2
                    if (response.IsSuccessStatusCode)
                    {
                        responseBody = response.Content.ReadAsStringAsync().Result;
                    }

                    List<Repo>? root = JsonConvert.DeserializeObject<List<Repo>>(responseBody);
                    if (root == null)
                    {
                        return null;
                    }

                    dynamic? langObj;
                    List<object> langList = new List<object>();

                    foreach (Repo repo in root.Where(o => o.owner.login == $"{login}"))
                    {
                        string url = repo.languages_url;

                        HttpResponseMessage langResponse = client.GetAsync(url).Result;
                        if (langResponse.IsSuccessStatusCode)
                        {
                            string langBody = langResponse.Content.ReadAsStringAsync().Result;
                            langObj = JsonConvert.DeserializeObject<dynamic>(langBody);

                            if (langObj == null)
                            {
                                continue;
                            }

                            langList.Add(langObj);
                        }
                    }

                    Dictionary<string, int> langData = new Dictionary<string, int>();
                    foreach (var l in langList)
                    {
                        if (l != null)
                        {
                            Dictionary<string, int>? lJson = JsonConvert.DeserializeObject<Dictionary<string, int>>(l.ToString());
                            if (lJson == null)
                            {
                                return null;
                            }

                            foreach (KeyValuePair<string, int> kvp in lJson)
                            {
                                if (!langData.ContainsKey(kvp.Key))
                                {
                                    langData.Add(kvp.Key, kvp.Value);
                                }
                                else
                                {
                                    langData[kvp.Key] = langData[kvp.Key] + kvp.Value;
                                }
                            }
                        }
                    }
                    int sum = langData.Sum(x => x.Value);
                    Dictionary<string, int> sortedLangData = (from lang in langData
                                                              orderby lang.Value descending
                                                              select lang)
                                                              .ToDictionary(l => l.Key, l => l.Value);
                    return sortedLangData;
                }
            }
            catch
            {
                return null;
            }
        }
    }
}
