using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblWarning
{
    public short WarningId { get; set; }

    public string? WarnDescription { get; set; }

    public virtual ICollection<TblContain> TblContains { get; set; } = new List<TblContain>();
}
