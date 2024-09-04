namespace WebApi.DTO
{
    public class EditTripDTO
    {
        public int TripId { get; set; }

        public string? TripTitle { get; set; }

        public string? Area { get; set; }

        public string? TripDescription { get; set; }

        public DateTime? TripDate { get; set; }

        public string? Season { get; set; }

        public string? Tips { get; set; }

        public short[] PropID { get; set; }

        public short[] TypeID { get; set; }

        public short[] TagId { get; set; }
    }
}
