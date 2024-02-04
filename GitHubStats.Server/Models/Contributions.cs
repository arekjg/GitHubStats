namespace GitHubStats
{
    public class ContributionsRoot
    {
        public Data data { get; set; }
    }

    public class ContributionCalendar
    {
        public List<string> colors { get; set; }
        public int totalContributions { get; set; }
        public List<Week> weeks { get; set; }
    }

    public class ContributionDay
    {
        public string color { get; set; }
        public int contributionCount { get; set; }
        public string date { get; set; }
        public int weekday { get; set; }
    }

    public class ContributionsCollection
    {
        public ContributionCalendar contributionCalendar { get; set; }
    }

    public class Data
    {
        public ContributionsUser user { get; set; }
    }

    public class ContributionsUser
    {
        public string name { get; set; }
        public ContributionsCollection contributionsCollection { get; set; }
    }

    public class Week
    {
        public List<ContributionDay> contributionDays { get; set; }
        public string firstDay { get; set; }
    }
}
