using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace GitHubStats
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public User? GetUserData(string login, string token)
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

                    string responseBody = "";
                    HttpResponseMessage response = client.GetAsync($"https://api.github.com/users/{login}").Result;

                    if (response.IsSuccessStatusCode)
                    {
                        responseBody = response.Content.ReadAsStringAsync().Result;
                    }
                    return JsonConvert.DeserializeObject<User>(responseBody);
                }
            }
            catch
            {
                return null;
            }
        }
    }
}