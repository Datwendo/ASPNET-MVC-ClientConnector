using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.IO;
using System.Reflection;
using MVCClientConnector.Models;
using System.Web.Mvc;


namespace MVCClientConnector.Services
{
    public enum RequestType { NoData = 0, DataString = 1, DataBlob = 2 }
    
    public class ClientConnectorService 
    {
      
        private const string CCtorAPIController     = "CCtor";
        private const string DataCCtorAPIController = "DataCCtor";
        private const string BlobCCtorAPIController = "BlobCCtor";

        private const string AdminCCtorAPIController = "AdminCCtor";
        private const string TraceCCtorAPIController = "TraceCCtor";

        int _ConnectorId                            = 0;
        string _SecretKey                           = string.Empty;

        public ClientConnectorService(int ConnectorId,string SecretKey) 
        {
            _ConnectorId    = ConnectorId;
            _SecretKey      = SecretKey;
        
        }

       
        #region settings
     
        
        public string ServiceProdUrl
        {
            get
            {
                string srv          = "http://datwendosvc.cloudapp.net";
                return string.Format("{0}/api/v{1}", srv, 1);
            }
        }

        public int TransacKeyDelay
        {
            get
            {
                return 200;
            }
        }

        int PublisherId
        {
            get
            {
                return 0; // Zero is the null publisher
            }
        }
        
        #endregion // Settings

        #region Settings attached to Content Type

       
        public int GetConnectorId()
        {
            return _ConnectorId;
        }

        public string GetSecretKey() 
        {
            return _SecretKey;
        }

        public RequestType GetRequestType()
        {
            return RequestType.NoData;
        }


        bool IsFast()
        {
            return true;
        }

        #endregion // Settings attached to Content Type

        #region WebAPI Calls

        #region Transac Calls

        // Extract a new transaction key from server
        public bool TransacKey(out string NewKey)
        {
            bool ret                        = false;
            NewKey                          = string.Empty;

            CCtrRequest2 CParam             = new CCtrRequest2
            {
                Ky                          = GetSecretKey(),
                Dl                          = TransacKeyDelay
            };

            try
            {
                var tsk                     = Post4TransacAsync(GetConnectorId(), CParam);
                CCtrResponse2 CRep          = tsk.Result;
                if (CRep.Cd == 0)
                {
                    ret                     = true;
                    NewKey                  = CRep.Ky;
                }
            }
            catch (Exception ex)
            {
                ret                         = false;
            }

            return ret;
        }

        private async Task<CCtrResponse2> Post4TransacAsync(int CId, CCtrRequest2 CReq)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponse2 result                = null;
            try
            {
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}", ServiceProdUrl, CCtorAPIController, CId));
                HttpResponseMessage response    = client.PostAsJsonAsync(address.ToString(),CReq).Result;
                response.EnsureSuccessStatusCode();
                result                          = await response.Content.ReadAsAsync<CCtrResponse2>();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        #endregion // transac call

        #region Base Connector

        // Read the actual value for Connector
        public bool Read(out int Val)
        {
            bool ret                            = false;
            Val                                 = int.MinValue;

            string NewKey                       = GetSecretKey();
            if (!IsFast() && !TransacKey(out NewKey))
                return false;
            UrlHelper uh                        = new UrlHelper(HttpContext.Current.Request.RequestContext);
            string ky                           = uh.Encode(NewKey);
            
            try
            {
                var tsk                         = GetAsync(GetConnectorId(),ky);
                CCtrResponse CRep               = tsk.Result;
                if (CRep.Cd == 0 )
                {
                    ret                         = true;
                    Val                         = CRep.Vl;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return ret;
        }

        private async Task<CCtrResponse> GetAsync(int CId,string Ky)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponse result                 = null;
            try
            {
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}?Ky={3}", ServiceProdUrl, CCtorAPIController, CId, Ky));
                HttpResponseMessage response    = client.GetAsync(address.ToString()).Result;
                response.EnsureSuccessStatusCode();
                result                          = await response.Content.ReadAsAsync<CCtrResponse>();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public bool ReadNext(object val,out int newVal)
        {
            switch(GetRequestType())
            {
                default:
                case RequestType.NoData:
                    return ReadNextNoData(out newVal);
                case RequestType.DataString:
                    return ReadNextData((string)val,out newVal);
                case RequestType.DataBlob:
                    return ReadNextBlob((IEnumerable<string>)val, out newVal);
            }
        }


        public bool ReadNextNoData(out int newVal)
        {
            bool ret                        = false;
            newVal                          = int.MinValue;
      
            string NewKey                   = GetSecretKey();
            if ( !IsFast()  && !TransacKey(out NewKey))
                return false;

            PubCCtrRequest CReq             = new PubCCtrRequest
            {
                Ky                          = NewKey,
                Pb                          = PublisherId
            };                

            try
            {
                var tsk                     = PutAsync(GetConnectorId(),CReq);
                CCtrResponse CRep           = tsk.Result;
                if (CRep.Cd == 0)
                {
                    newVal                  = CRep.Vl;
                    ret                     = true;
                }
            }
            catch (Exception ex)
            { 
                ret                         = false;
            }
            return ret;
        }

        private async Task<CCtrResponse> PutAsync(int CId, PubCCtrRequest CReq)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponse result                 = null;
            try
            {
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}", ServiceProdUrl, CCtorAPIController, CId));
                HttpResponseMessage response    = client.PutAsJsonAsync(address.ToString(), CReq).Result;
                response.EnsureSuccessStatusCode();
                result                          = await response.Content.ReadAsAsync<CCtrResponse>();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        #endregion Base Connector

        #region DataStorage Connector

        // Read the actual value for Connector
        public bool ReadData(int idx, out string strVal)
        {
            bool ret        = false;
            strVal          = string.Empty;
            string NewKey   = GetSecretKey();

            if (!IsFast() && !TransacKey(out NewKey))
                return false;
            UrlHelper uh = new UrlHelper(HttpContext.Current.Request.RequestContext);
            string ky       = uh.Encode(NewKey);

            try
            {
                var tsk     = GetWithDataAsync(GetConnectorId(), idx, ky);
                CCtrResponseSt CRep = tsk.Result;
                if (CRep.Cd == 0)
                {
                    ret     = true;
                    strVal  = CRep.St;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return ret;
        }

        private async Task<CCtrResponseSt> GetWithDataAsync(int CId, int Ix, string Ky)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponseSt result               = null;
            try
            {
                //Get(int id,int ix,string Ky)
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}?ix={3}&Ky={4}", new object[] { ServiceProdUrl, DataCCtorAPIController, CId, Ix, Ky }));
                HttpResponseMessage response    = client.GetAsync(address.ToString()).Result;
                response.EnsureSuccessStatusCode();
                result = await response.Content.ReadAsAsync<CCtrResponseSt>();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public bool ReadNextData(string strVal,out int newVal)
        {
            string strval       = string.Empty;
            newVal              = 0;
            return ReadNextWithData(strval, out newVal);
        }

        public bool ReadNextWithData(string strval, out int newVal)
        {
            bool ret                = false;
            newVal                  = int.MinValue;

            string NewKey           = GetSecretKey();

            if (!IsFast() && !TransacKey(out NewKey))
                return false;

            StringStorRequest CReq  = new StringStorRequest
            {
                Ky                  = NewKey,
                Pb                  = PublisherId,
                St                  = strval
            };

            try
            {
                var tsk             = PutWithDataAsync(GetConnectorId(), CReq);
                CCtrResponse CRep   = tsk.Result;
                if (CRep.Cd == 0)
                {
                    newVal          = CRep.Vl;
                    ret             = true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return ret;
        }

        private async Task<CCtrResponse> PutWithDataAsync(int CId, StringStorRequest CReq)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponse result                 = null;
            try
            {
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}", ServiceProdUrl, DataCCtorAPIController, CId));
                HttpResponseMessage response    = client.PutAsJsonAsync(address.ToString(), CReq).Result;
                response.EnsureSuccessStatusCode();
                result                          = await response.Content.ReadAsAsync<CCtrResponse>();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }              

        #endregion // DataStorage Connector

        #region Blob Storage


        // Read the actual value for Connector
        public bool ReadBlob(int idx, out IEnumerable<FileDesc> newVal)
        {
            bool ret        = false;
            newVal          = null;
            string NewKey   = GetSecretKey();

            if (!IsFast() && !TransacKey( out NewKey))
                return false;

            UrlHelper uh = new UrlHelper(HttpContext.Current.Request.RequestContext);
            string ky       = uh.Encode(NewKey);

            try
            {
                var tsk     = GetBlobAsync(GetConnectorId(), idx, ky);
                CCtrResponseBlob CRep = tsk.Result;
                if (CRep.Cd == 0)
                {
                    ret     = true;
                    newVal  = CRep.Lst;
                }
            }
            catch (Exception ex)
            {
               return false;
            }
            return ret;
        }

        //GET api/v1/BlobCCtor/{id}?Ix={Ix}&Ky={Ky}
        private async Task<CCtrResponseBlob> GetBlobAsync(int CId, int Ix, string Ky)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponseBlob result             = null;
            try
            {
                //Get(int id,int ix,string Ky)
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}?Ix={3}&Ky={4}", new object[] { ServiceProdUrl, BlobCCtorAPIController, CId, Ix, Ky }));
                HttpResponseMessage response    = client.GetAsync(address.ToString()).Result;
                response.EnsureSuccessStatusCode();
                result                          = await response.Content.ReadAsAsync<CCtrResponseBlob>();
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }


        public bool ReadNextBlob( IEnumerable<string> fileList,out int newVal)
        {
            IEnumerable<FileDesc> nVal      = null;
            bool ret                        = ReadNextWithBlob(fileList, out nVal);
            newVal                          = (nVal == null || nVal.Count() == 0 ) ? 0: nVal.First().CounterVal;
            return ret;
        }

        public bool ReadNextWithBlob(IEnumerable<string> fileList, out IEnumerable<FileDesc> newVal)
        {
            bool ret                    = false;
            newVal                      = null;

            string NewKey               = GetSecretKey();

            if (!IsFast() && !TransacKey(out NewKey))
                return false;

            try
            {
                var tsk                 = PostBlobAsync(GetConnectorId(), PublisherId, NewKey, fileList);
                CCtrResponseBlob CRep   = tsk.Result;
                if (CRep.Cd == 0)
                {
                    newVal              = CRep.Lst;
                    ret                 = true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return ret;
        }

        // POST api/v1/BlobCCtor/{Id}?Pb={Pb}&Ky={Ky}
        private async Task<CCtrResponseBlob> PostBlobAsync(int CId, int PublisherId, string NewKey, IEnumerable<string> fileList)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponseBlob result             = null;
            try
            {
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}?Pb={3}&Ky={4}", new object[] { ServiceProdUrl, BlobCCtorAPIController, CId, PublisherId, NewKey }));
                using (var content              = new MultipartFormDataContent())
                {
                    foreach (string file in fileList)
                    {
                        var fileContent         = new StreamContent(File.OpenRead(file));
                        fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                        {
                            FileName = file
                        };
                        content.Add(fileContent);
                    }

                    HttpResponseMessage response    = client.PostAsync(address, content).Result;
                    response.EnsureSuccessStatusCode();
                    result                          = await response.Content.ReadAsAsync<CCtrResponseBlob>();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }


        #endregion // Blob Storage

        #region Admin calls
        /*
        public bool SetTrace(bool TraceState)
        {
            bool ret                = false;

            string NewKey           = SecretKey;
            if (!IsFast && !TransacKey(out NewKey))
                return false;

            CCtrRequestTr CReq      = new CCtrRequestTr
            {
                Ky                  = NewKey,
                St                  = TraceState
            };

            try
            {
                var tsk             = SetTraceAsync(ConnectorId, CReq);
                CCtrResponseTr CRep = tsk.Result;
                if (CRep.Cd == 0 || CRep.Cd == -1)
                {
                    ret             = true;
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, ex, "ClientConnectorService Start {0} - {1}", new Object[] { SecretKey, ConnectorId });
                return false;
            }
            return ret;
        }

        private async Task<CCtrResponseTr> SetTraceAsync(int CId, CCtrRequestTr CReq)
        {
            HttpClient client                   = new HttpClient();
            CCtrResponseTr result               = null;
            try
            {
                Uri address                     = new Uri(string.Format("{0}/{1}/{2}", ServiceAdminUrl, TraceCCtorAPIController, CId));
                HttpResponseMessage response    = client.PutAsJsonAsync(address.ToString(), CReq).Result;
                response.EnsureSuccessStatusCode();
                result                          = await response.Content.ReadAsAsync<CCtrResponseTr>();
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, ex, "SetTraceAsync Error reading from WebAPI");
                throw;
            }
            return result;
        }


        public bool Start()
        {
            bool ret                        = false;

            string NewKey                   = SecretKey;
            if ( !IsFast && !TransacKey( out NewKey))
                return false;

            CCtrRequest2 CReq               = new CCtrRequest2
            {
                Ky                          = NewKey,
                Dl                          = TransacKeyDelay
            };                

            try
            {
                var tsk                     = StartAsync(ConnectorId,CReq);
                CCtrResponse2 CRep          = tsk.Result;
                if (CRep.Cd == 0 || CRep.Cd == -1)
                {
                    ret                     = true;
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, ex, "ClientConnectorService Start {0} - {1}", new Object[] {SecretKey, ConnectorId });
                return false;
            }
            return ret;
        }

        private async Task<CCtrResponse2> StartAsync(int CId, CCtrRequest2 CReq)
        {
            HttpClient client                       = new HttpClient();
            CCtrResponse2 result                    = null;
            try
            {
                Uri address                         = new Uri(string.Format("{0}/{1}/{2}", ServiceAdminUrl, AdminCCtorAPIController, CId));
                HttpResponseMessage response        = client.PostAsJsonAsync(address.ToString(), CReq).Result;
                response.EnsureSuccessStatusCode();
                result                              = await response.Content.ReadAsAsync<CCtrResponse2>();
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, ex, "StartAsync Error reading from WebAPI");
                throw;
            }
            return result;
        }

        public bool Stop()
        {
            bool ret                        = false;

            string NewKey                   = SecretKey;
            if (!IsFast && !TransacKey(out NewKey))
                return false;

            UrlHelper uh                    = new UrlHelper(HttpContext.Current.Request.RequestContext);
         
            string ky                       = uh.Encode(NewKey);
            try
            {
                var tsk                     = StopAsync(ConnectorId,ky);
                CCtrResponse2 CRep          = tsk.Result;
                if (CRep.Cd == 0 || CRep.Cd == -1)
                {
                    ret                     = true;
                }
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, ex, "ClientConnectorService Stop {0} - {1}", new Object[] {SecretKey, ConnectorId });
                return false;
            }
            return ret;
        }

        private async Task<CCtrResponse2> StopAsync(int CId, string Ky)
        {
            HttpClient client                           = new HttpClient();
            CCtrResponse2 result                        = null;
            try
            {
                Uri address                             = new Uri(string.Format("{0}/{1}/{2}?Ky={3}", ServiceAdminUrl, AdminCCtorAPIController, CId,Ky));
                HttpResponseMessage response            = client.DeleteAsync(address.ToString()).Result;
                response.EnsureSuccessStatusCode();
                result                                  = await response.Content.ReadAsAsync<CCtrResponse2>();
            }
            catch (Exception ex)
            {
                Logger.Log(LogLevel.Error, ex, "StopAsync Error reading from WebAPI");
                throw;
            }
            return result;
        }
         * */
        #endregion // admin calls

        #endregion // WebAPI Calls
    }
}