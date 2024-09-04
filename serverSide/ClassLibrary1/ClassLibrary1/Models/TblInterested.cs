using System;
using System.Collections.Generic;

namespace ClassLibrary1.Models;

public partial class TblInterested
{
    public string UserName { get; set; } = null!;

    public short PropertyId { get; set; }

    public bool? Dummy { get; set; }

    public virtual TblProperty Property { get; set; } = null!;

    public virtual TblUser UserNameNavigation { get; set; } = null!;
}
