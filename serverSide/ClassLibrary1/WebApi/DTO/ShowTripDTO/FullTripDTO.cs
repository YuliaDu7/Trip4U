namespace WebApi.ShowTripDTO
{
    public class FullTripDTO
    {
        public int TripId { get; set; }

        public string? TripTitle { get; set; }

        public string? Area { get; set; }

        public string? TripDescription { get; set; }

        public DateTime? TripDate { get; set; }

        public int? FavoriteSum { get; set; }

        public string? Season { get; set; }

        public string? Tips { get; set; }

        public DateTime? PublishDate { get; set; }

        public string? UserName { get; set; }

        public List<PlaceDTO> PlacesInTrip { get; set; }

        public List<RestDTO> RestInTrip { get; set; }

        public List<CommentDTO> CommentsOnTrip { get; set; }

        public List<string> TripProperties { get; set; }

        public List<string> Tags { get; set; }

        public float? AvgRating { get; set; }

        public string? InstagramUrl { get; set; }

        public bool? isInfluencer { get; set; }

        public bool? IsFavorite { get; set; }

    }
}
