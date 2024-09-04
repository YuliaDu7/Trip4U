namespace WebApi.DTO
{
    public class ResultsDTO
    {
        public List<string> Tags { get; set; }

        public int TripId { get; set; }

        public string? TripTitle { get; set; }

        public int? FavoriteSum { get; set; }

        public string? UserName { get; set; }
    }
}
