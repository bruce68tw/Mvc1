using Base.Models;
using Base.Services;
using BaseApi.Attributes;
using BaseApi.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Mvc1.Controllers
{
    public class HomeController : Controller
    {
        private bool encodePwd = true;

        [XgLogin]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login(string url = "")
        {
            return View(new LoginVo() { FromUrl = url });
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginVo vo)
        {
            return await _Login.LoginByVoA(vo, encodePwd)
                ? Redirect(_Str.IsEmpty(vo.FromUrl) ? "/Home/Index" : vo.FromUrl)
                : View(vo);
        }

        public ActionResult Logout()
        {
            _Http.SetCookie(_Fun.FidClientKey, "");
            return Redirect("/Home/Login");
        }

        public ActionResult Error()
        {
            var error = HttpContext.Features.Get<IExceptionHandlerFeature>();
            return View("Error", (error == null) ? _Fun.SystemError : error.Error.Message);
        }

    }
}