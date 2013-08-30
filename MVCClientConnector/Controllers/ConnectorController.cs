using MVCClientConnector.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MVCClientConnector.Controllers
{
    public class ConnectorController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        
        [HttpPost]
        public ActionResult Index(int Id,string Ky)
        {
            ClientConnectorService svc = new ClientConnectorService(Id,Ky);
            int newVal = 0;
            svc.ReadNext(null, out newVal);
            ViewBag.CId = Id;
            ViewBag.secK = Ky;
            ViewBag.newVal = newVal;

            return Index();
        }
    }
}
