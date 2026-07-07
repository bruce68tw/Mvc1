using Base.Interfaces;
using Base.Models;
using Base.Services;
using BaseApi.Extensions;
using BaseApi.Services;

namespace Mvc1.Services
{
    public class MyBaseUserSvc : IBaseUserSvc
    {
        //get base user info
        public BaseUserDto GetData()
        {
            return _Http.CookieToBr();
        }
    }
}
