namespace WebApi.DTO
{
    public class UpdateGroupTripDTO
    {
        public int TripId { get; set; }

        public string? TripTitle { get; set; }

        public string? Area { get; set; }

        public string? TripDescription { get; set; }

        public DateTime? TripDate { get; set; }


        public VisitsInDTO[] PlacesInTrip { get; set; }

        public EatsInDTO[] RestInTrip { get; set; }
    }
}
