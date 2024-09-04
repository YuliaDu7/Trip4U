using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblContain
{
    public short WarningId { get; set; }

    public short PlaceId { get; set; }

    public DateTime? ReceiveDate { get; set; }

    public virtual TblPlace Place { get; set; } = null!;

    public virtual TblWarning Warning { get; set; } = null!;
}
