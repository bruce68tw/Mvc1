using Base.Services;
using BaseApi.Services;
using Microsoft.AspNetCore.Mvc;
using Mvc1.Enums;

namespace Mvc1.Services
{
    //project service
#pragma warning disable CA2211 // 非常數欄位不應可見
    public static class _Xp
    {
        //public const string SiteVer = "20201228f";     //for my.js/css
        public static string MyVer = _Date.NowSecStr(); //for my.js/css
        public const string LibVer = "20210712e";       //for lib.js/css

        //public static string NoImagePath = _Fun.DirRoot + "/wwwroot/image/noImage.jpg";

        //dir
        public static string DirTpl = _Fun.DirRoot + "_template/";
        public static string DirUpload = _Fun.DirRoot + "_upload/";
        //public static string DirLeave = DirUpload + "Leave/";
        //public static string DirUserExt = DirUpload + "UserExt/";
        //public static string DirUserLicense = DirUpload + "UserLicense/";
        //public static string DirCustInput = DirUpload + "CustInput/";
        //public static string DirUserImport = DirUpload + "UserImport/";
        //dir cms
        public static string DirCms = DirUpload + "Cms";

        //public static string Locale;
        //public static string LocaleNoDash;

        //view columns 
        //public static int[] ViewCols = new int[] { 12, 2, 3 };

        /*
        public static MyContext GetDb()
        {
            return new MyContext();
        }
        */

        public static string CmsTypeToProgName(string cmsType)
        {
            return cmsType switch
            {
                CmsTypeEstr.Msg => "最新消息維護",
                CmsTypeEstr.Card => "電子賀卡維護",
                _ => "??"
            };
        }

        #region get file path
        /*
        public static string PathUserExt(string key, string ext)
        {
            //return _File.GetFirstPath(DirUserExt, "PhotoFile_" + key, NoImagePath);
            return $"{DirUserExt}PhotoFile_{key}.{ext}";
        }
        */
        #endregion

        public static string DirCmsType(string cmsType)
        {
            return DirCms + cmsType + "/";
        }

        #region get file content
        private static FileResult? ViewFile(string dir, string fid, string key, string ext)
        {
            var path = $"{dir}{fid}_{key}.{ext}";
            return _HttpFile.ViewFile(path, $"{fid}.{ext}");
        }

        #endregion

        /// <summary>
        /// get locale code without dash sign
        /// </summary>
        /// <returns></returns>
        public static string GetLocale0()
        {
            return _Locale.GetLocale();
        }

        /// <summary>
        /// get template file
        /// </summary>
        /// <returns></returns>
        public static string GetTplPath(string fileName, bool hasLocale)
        {
            var dir = DirTpl;
            if (hasLocale)
                dir += _Locale.GetLocale() + "/";

            return dir + fileName;
        }

    }//class
#pragma warning restore CA2211 // 非常數欄位不應可見
}