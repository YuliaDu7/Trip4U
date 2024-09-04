namespace WebApi.ShowTripDTO
{
    public class RestDTO
    {
        public string? RestName { get; set; }

        public string? RestDescription { get; set; }

        public string? RestUrl { get; set; }

        public string? RestMap { get; set; }

        public byte? RestRating { get; set; }

        public byte? IsKosher { get; set; }

        public short? AvgCost { get; set; }

        public byte? RestPlaceInTrip { get; set; }
    }
}
