using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace GitHubStats
{
    [ApiController]
    [Route("[controller]")]
    public class LanguagesController : ControllerBase
    {
        [HttpGet]
        public Dictionary<string, int>? GetLanguagesData(string login, string token, int repoCount)
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

                    int pageCount = (int)Math.Ceiling(repoCount / 100.0);
                    var roots = new List<Repo>();

                    for (int i = 0; i < pageCount; i++)
                    {
                        string responseBody = "";
                        HttpResponseMessage response = client.GetAsync($"https://api.github.com/user/repos?per_page=100&page={i + 1}").Result;
                        
                        if (response.IsSuccessStatusCode)
                        {
                            responseBody = response.Content.ReadAsStringAsync().Result;
                        }

                        var root = JsonConvert.DeserializeObject<List<Repo>>(responseBody);
                        if (root == null)
                        {
                            return null;
                        }

                        foreach (Repo repo in root.Where(r => r.owner.login == $"{login}"))
                        {
                            roots.Add(repo);
                        }
                    }

                    var langList = new List<object>();

                    foreach (Repo repo in roots.Where(r => r.owner.login == $"{login}"))
                    {
                        string url = repo.languages_url;

                        HttpResponseMessage langResponse = client.GetAsync(url).Result;
                        if (langResponse.IsSuccessStatusCode)
                        {
                            string langBody = langResponse.Content.ReadAsStringAsync().Result;
                            var langObj = JsonConvert.DeserializeObject<object>(langBody);

                            if (langObj == null)
                            {
                                continue;
                            }

                            langList.Add(langObj);
                        }
                    }

                    var langData = new Dictionary<string, int>();
                    foreach (var l in langList)
                    {
                        if (l != null)
                        {
                            var lJson = JsonConvert.DeserializeObject<Dictionary<string, int>>(l.ToString());
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
                    var sortedLangData = (from lang in langData
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
