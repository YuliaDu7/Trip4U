namespace WebApi.ShowTripDTO
{
    public class PlaceDTO
    {
        public string? PlaceName { get; set; }

        public string? PlaceDescription { get; set; }

        public string? PlaceMap { get; set; }

        public short? PlaceCost { get; set; }

        public short? ChildCost { get; set; }

        public string? RecommendedTime { get; set; }

        public byte? PlacePlaceInTrip { get; set; }

        //זה להצגת טיול
        public List<string> WarnDescription { get; set; }

        public DateTime? ReceiveDate { get; set; }
    }
}
