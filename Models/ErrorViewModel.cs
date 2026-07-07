using Base.Services;
using System;

namespace Mvc1.Models
{
    public class ErrorViewModel
    {
        public string RequestId { get; set; } = "";

        public bool ShowRequestId => !_Str.IsEmpty(RequestId);
    }
}
