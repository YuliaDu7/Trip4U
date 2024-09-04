using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblTypeClick
{
    public short TypeId { get; set; }

    public string UserName { get; set; } = null!;

    public int? Click { get; set; }

    public virtual TblType Type { get; set; } = null!;

    public virtual TblUser UserNameNavigation { get; set; } = null!;
}
