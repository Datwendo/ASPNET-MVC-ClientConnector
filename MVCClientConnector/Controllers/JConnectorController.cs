using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVCClientConnector.Controllers
{
    public class JConnectorController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Test()
        {
            return View();
        }

        public ActionResult TestIntString()
        {
            return View();
        }

        public ActionResult TestIntBlob(int? id)
        {
            return View();
        }
    }
}
