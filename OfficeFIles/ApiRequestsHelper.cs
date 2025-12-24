using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace RB0120.ApiRequestsHelper
{
    internal class ApiRequestsHelper
    {
        private readonly HttpClient _httpClient;

        public ApiRequestsHelper()
        {
            _httpClient = new HttpClient
            {
                Timeout = Timeout.InfiniteTimeSpan   // timeout rieši SendAsync cez CTS
            };
        }

        /// <summary>
        /// Pošle viac requestov naraz (paralelne).
        /// </summary>
        public async Task<List<ApiResponse>> SendMultipleAsync(IEnumerable<HttpRequestItem> requests, int maxParallelism = 10)
        {
            if (requests == null)
                throw new ArgumentNullException(nameof(requests));

            var semaphore = new SemaphoreSlim(maxParallelism);
            var tasks = new List<Task<ApiResponse>>();

            foreach (var req in requests)
            {
                await semaphore.WaitAsync();

                tasks.Add(Task.Run(async () =>
                {
                    try
                    {
                        return await SendAsync(req.Url, req.Method, req.Body, req.Headers);
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                }));
            }

            return new List<ApiResponse>(await Task.WhenAll(tasks));
        }

        /// <summary>
        /// Pošle jeden HTTP request asynchrónne.
        /// </summary>
        public async Task<ApiResponse> SendAsync(string url, HttpMethod method, string? body = null, Dictionary<string, string>? headers = null)
        {
            try
            {
                using var request = new HttpRequestMessage(method, url);

                if (!string.IsNullOrEmpty(body))
                    request.Content = new StringContent(body, Encoding.UTF8, "application/json");

                if (headers != null)
                {
                    foreach (var kv in headers)
                        request.Headers.Add(kv.Key, kv.Value);
                }

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                var httpResponse = await _httpClient.SendAsync(request, cts.Token);

                string content = await httpResponse.Content.ReadAsStringAsync(cts.Token);

                List<DataTable> tables;

                // API buď vracia
                // 1) [ { name, data } ]  --> podľa tvojho formátu
                // 2) alebo priamo výstup SELECTu
                try
                {
                    tables = ApiDataTableParser.ParseApiResultToDataTables(content);
                }
                catch
                {
                    tables = new List<DataTable>();  // iný formát – OK
                }

                return new ApiResponse
                {
                    Url = url,
                    Method = method.Method,
                    StatusCode = (int)httpResponse.StatusCode,
                    Data = tables
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Url = url,
                    Method = method.Method,
                    StatusCode = 0,
                    ErrorMessage = ex.Message,
                    Data = new List<DataTable>()
                };
            }
        }
    }


    public class HttpRequestItem
    {
        public string Url { get; set; } = "";
        public HttpMethod Method { get; set; } = HttpMethod.Get;
        public string? Body { get; set; }
        public Dictionary<string, string>? Headers { get; set; }
    }

    public class ApiResponse
    {
        public string Url { get; set; } = "";
        public string Method { get; set; } = "GET";
        public int StatusCode { get; set; }
        public List<DataTable> Data { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
