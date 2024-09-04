﻿namespace WebApi.DTO
{
    public class AddPlaceDTO
    {
        public string? PlaceName { get; set; }

        public string? PlaceDescription { get; set; }

        public string? PlaceMap { get; set; }

        public short? PlaceCost { get; set; }

        public short? ChildCost { get; set; }

        public string? RecommendedTime { get; set; }        
        //זה להוספת טיול
        public short [] WarningId { get; set; }

    }
}
