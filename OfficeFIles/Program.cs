using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Linq;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Vml;
using DocumentFormat.OpenXml.Wordprocessing;
using Newtonsoft.Json;
using RB0120.ApiRequestsHelper;
using RB0120.WordHelper;    // namespace import (zachované)
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using URB0120API = RB0120.ApiRequestsHelper.ApiRequestsHelper;
/* Alias pre WordHelper triedu (pomôcka) */
using WH = RB0120.WordHelper.WordHelper;
using EH = RB0120.ExcelHelper.ExcelHelper;

namespace RB0120
{
    class Program
    {
        static async Task<int> Main()
        {
            string sourcePath = @"X:\Projects\_indev\rb0120Test\jej.docx";
            string phhPath = @"X:\Projects\_indev\rb0120Test\PHV_KONSOLIDOVANE_preROBOTA_k 1.11.2025.docx";
            string destPath = @"X:\Projects\_indev\rb0120Test\vystup_prepared.docx";
            string initials = @"MP";
            string string_date = @"14.12.2025";
            

            try
            {
                var pzsList = new List<string> { "P66657", "P71991"};
                string pzsBodyJson = System.Text.Json.JsonSerializer.Serialize(pzsList);

                string authString = $"testuser:testpassword";
                string base64Auth = Convert.ToBase64String(Encoding.UTF8.GetBytes(authString));
                var headers = new Dictionary<string, string>
                {
                    { "Authorization", $"Basic {base64Auth}" }
                };
                var RB0120API = new URB0120API();
                ApiResponse response = await RB0120API.SendAsync("https://rpatest.union.sk/api/rb0120/podpis_dod_ustav", HttpMethod.Post, pzsBodyJson, headers);

                if (response == null || response.ErrorMessage != null)
                {
                    Console.WriteLine("❌ Request nevratil data.");
                    return 2;
                }

                DataTable dtInput = (response.Data.FirstOrDefault(t => t.TableName == "podpis_dod_ustav")).Copy();
                response = null;

                if (!(dtInput.Rows.Count > 0))
                {
                    Console.WriteLine("❌ Input neobsahuje data.");
                    return 2;
                }

                static DataTable LoadMappingUstavne()
                {
                    // cesta k JSON v priečinku kde sa spúšťa robot
                    string mappingPath = System.IO.Path.Combine("X:\\Projects\\_indev\\rb0120Test\\RB0120", "mapping_ustavne.json");

                    if (!File.Exists(mappingPath))
                        throw new FileNotFoundException($"Súbor nenájdený: {mappingPath}");

                    // načítanie textu
                    string json = File.ReadAllText(mappingPath);

                    // deserializácia zoznamu
                    var list = JsonConvert.DeserializeObject<List<MappingItem>>(json);

                    // prekonvertovanie na DataTable
                    DataTable dt = new DataTable("mapping_ustavne");

                    dt.Columns.Add("cast", typeof(string));
                    dt.Columns.Add("segment", typeof(string));
                    dt.Columns.Add("typ_fo", typeof(string));
                    dt.Columns.Add("typ_pracoviska", typeof(string));
                    dt.Columns.Add("odbornosti", typeof(string));
                    dt.Columns.Add("validflag", typeof(string));

                    foreach (var item in list)
                    {
                        dt.Rows.Add(
                            item.Cast,
                            item.Segment,
                            item.TypFo,
                            item.TypPracoviska,
                            item.Odbornosti,
                            item.ValidFlag
                        );
                    }

                    // vrátime DataTable + array
                    return dt;
                }

                DataTable dd = LoadMappingUstavne();

        


                // 1) Načítaj zdroj do pamäti
                InMemoryWordDocument inMem = await WH.LoadWordDocumentAsync(sourcePath);
                if (inMem == null || inMem.Body == null)
                {
                    Console.WriteLine("❌ Nebolo možné načítať zdrojový dokument alebo telo je prázdne.");
                    return 2;
                }

                // 1) Načítaj zdroj do pamäti
                InMemoryWordDocument inPHH = await WH.LoadWordDocumentAsync(phhPath);
                if (inPHH == null || inPHH.Body == null)
                {
                    Console.WriteLine("❌ Nebolo možné načítať zdrojový dokument alebo telo je prázdne.");
                    return 2;
                }

                var bodyObject = new
                {
                    zoz_pzs = dtInput.AsEnumerable()
                    .Where(a => !string.IsNullOrEmpty(a["zoz_pzs"]?.ToString()) && !string.IsNullOrWhiteSpace(a["zoz_pzs"]?.ToString()) && (a["zoz_pzs"] != DBNull.Value))
                    .Select(r => r["zoz_pzs"]?.ToString())
                    .Distinct()
                    .Select(z => new
                    {
                        zoz_pzs=z,
                        new_date=string_date
                    })
                    .ToList()
                };
                string bodyJson = System.Text.Json.JsonSerializer.Serialize(bodyObject);


                var requests = new List<HttpRequestItem>
                {
                    new HttpRequestItem
                    {
                        Url = "https://rpatest.union.sk/api/rb0120/spady",
                        Method = HttpMethod.Post,
                        Headers = headers
                    },
                    new HttpRequestItem
                    {
                        Url = "https://rpatest.union.sk/api/rb0120/strix_programy",
                        Method = HttpMethod.Post,
                        Headers = headers
                    },
                    new HttpRequestItem
                    {
                        Url = "https://rpatest.union.sk/api/rb0120/fogb",
                        Method = HttpMethod.Post,
                        Headers = headers
                    },
                    new HttpRequestItem
                    {
                        Url = "https://rpatest.union.sk/api/rb0120/zmluvne_ceny",
                        Method = HttpMethod.Post,
                        Headers = headers
                    },
                    new HttpRequestItem
                    {
                        Url = "https://rpatest.union.sk/api/rb0120/odd_prac",
                        Method = HttpMethod.Post,
                        Headers = headers
                    }
                };

                List<ApiResponse> responses = await RB0120API.SendMultipleAsync(requests, maxParallelism: 5);
                // ==========================================
                // 3) Kontrola chýb
                // ==========================================
                foreach (var resp in responses)
                {
                    if (!string.IsNullOrEmpty(resp.ErrorMessage))
                    {
                        Console.WriteLine($"ERROR in {resp.Url}: {resp.ErrorMessage}");
                    }
                    else
                    {
                        Console.WriteLine($"OK   -> {resp.Url}");
                    }
                }

                DataTable dtSpady = responses.First(r => r.Url.Contains("spady", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtSpady");
                DataTable dtStrixProgramy = responses.First(r => r.Url.Contains("strix_programy", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtStrixProgramy");
                DataTable dtFogb = responses.First(r => r.Url.Contains("fogb", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtFogb");
                DataTable dtZmluvneCeny = responses.First(r => r.Url.Contains("zmluvne_ceny", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtZmluvneCeny");
                DataTable dtOddPrac = responses.First(r => r.Url.Contains("odd_prac", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtOddPrac");
                responses = null;



                foreach (DataRow rowcek in dtInput.Rows)
                {
                    var requestsPzs = new List<HttpRequestItem>
                    {
                        new HttpRequestItem
                        {
                            Url = "https://rpatest.union.sk/api/rb0120/klastery/"+rowcek["zoz_pzs"].ToString()+"-"+string_date,
                            Method = HttpMethod.Post,
                            Headers = headers,
                            Body = bodyJson
                        },
                        new HttpRequestItem
                        {
                            Url = "https://rpatest.union.sk/api/rb0120/akceptacny/"+rowcek["zoz_pzs"].ToString(),
                            Method = HttpMethod.Post,
                            Headers = headers,
                            Body = bodyJson
                        },
                        new HttpRequestItem
                        {
                            Url = "https://rpatest.union.sk/api/rb0120/unik_kody/"+rowcek["zoz_pzs"].ToString(),
                            Method = HttpMethod.Post,
                            Headers = headers,
                            Body = bodyJson
                        }
                    };

                    List<ApiResponse> responsesPzs = await RB0120API.SendMultipleAsync(requestsPzs, maxParallelism: 3);
                    // ==========================================
                    // 3) Kontrola chýb
                    // ==========================================
                    foreach (var resp in responsesPzs)
                    {
                        if (!string.IsNullOrEmpty(resp.ErrorMessage))
                        {
                            Console.WriteLine($"ERROR in {resp.Url}: {resp.ErrorMessage}");
                        }
                        else
                        {
                            Console.WriteLine($"OK   -> {resp.Url}");
                        }
                    }

                    DataTable dtKlastery = responsesPzs.First(r => r.Url.Contains("klastery", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtKlastery");
                    DataTable dtAkceptacny = responsesPzs.First(r => r.Url.Contains("akceptacny", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtAkceptacny");
                    DataTable dtUnikKody = responsesPzs.First(r => r.Url.Contains("unik_kody", StringComparison.OrdinalIgnoreCase)).Data.FirstOrDefault() ?? new DataTable("dtUnikKody");
                    

                    

                    string ress = await WordRetAsync(inMem, inPHH, rowcek,string_date,initials, dd, destPath);
                }

                

        // 2) Priprav Body (pracujeme iba s kópiou v pamäti)
        //Body preparedBody = (Body)inMem.Body.CloneNode(true);

        // 3) Definuj nahradenia bookmarkov (príklad)
        /*var replacements = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    ["Table_Test1"] = "Testicek"
                };*/

                /*// ---------- Pomocné funkcie ----------
                void ReplaceBookmarkInBody(Body body, string bookmarkName, string text)
                {
                    if (body == null) return;

                    var bookmarkStart = body.Descendants<BookmarkStart>()
                        .FirstOrDefault(b => string.Equals(b.Name?.Value, bookmarkName, StringComparison.OrdinalIgnoreCase));
                    if (bookmarkStart == null) return;

                    var bookmarkEnd = body.Descendants<BookmarkEnd>().FirstOrDefault(be => be.Id == bookmarkStart.Id);
                    if (bookmarkEnd == null) return;

                    // vložíme nový run hneď za start
                    var newRun = new Run(new Text(text) { Space = SpaceProcessingModeValues.Preserve });
                    bookmarkStart.Parent.InsertAfter(newRun, bookmarkStart);

                    // odstránime existujúci obsah medzi start a end bezpečne (document order)
                    OpenXmlElement current = GetNextInDocumentOrder(bookmarkStart);
                    while (current != null && current != bookmarkEnd)
                    {
                        if (current is SectionProperties || current is Body || current is Document)
                            break;

                        if (IsAncestorOf(current, bookmarkEnd))
                        {
                            current = GetNextInDocumentOrder(current);
                            continue;
                        }

                        OpenXmlElement next = GetNextInDocumentOrder(current);
                        try { current.Remove(); } catch { // ignoruj chybu pri mazaní  
                            }
                        current = next;
                    }
                }

                bool IsAncestorOf(OpenXmlElement candidate, OpenXmlElement target)
                {
                    if (candidate == null || target == null) return false;
                    var p = target.Parent;
                    while (p != null)
                    {
                        if (p == candidate) return true;
                        p = p.Parent;
                    }
                    return false;
                }

                OpenXmlElement GetNextInDocumentOrder(OpenXmlElement el)
                {
                    if (el == null) return null;
                    if (el.FirstChild != null)
                        return el.FirstChild;
                    var next = el.NextSibling();
                    var parent = el.Parent as OpenXmlElement;
                    while (next == null && parent != null)
                    {
                        next = parent.NextSibling();
                        parent = parent.Parent as OpenXmlElement;
                    }
                    return next;
                }
                // ---------- KONIEC pomocných ----------

                // vykonaj nahradenia v preparedBody
                foreach (var kv in replacements)
                    ReplaceBookmarkInBody(preparedBody, kv.Key, kv.Value ?? string.Empty);

                // 4) Prepíš inMem.Body tak, aby SaveInMemoryDocumentAsync uložil aktualizované telo
                inMem.Body = (Body)preparedBody.CloneNode(true);

                // (Voliteľne) ak máš RootDocument a chceš tiež aby jeho Body odrážalo zmeny, aktualizuj RootDocument.Body:
                if (inMem.RootDocument != null)
                {
                    var rootClone = (Document)inMem.RootDocument.CloneNode(true);
                    var existingBody = rootClone.Body;
                    if (existingBody != null) existingBody.Remove();
                    rootClone.AppendChild((Body)inMem.Body.CloneNode(true));
                    inMem.RootDocument = rootClone;
                }*/

                /*InMemoryWordDocument inMen =  WH.ReplaceBookmarks(inMem, replacements);

                // 3) Príprava dokumentu
                var preparedDoc = WH.Prepare(inMem);

                // 4) Uloženie
                await WH.SaveInMemoryDocumentAsync(inMem, destPath, overwrite: true, includeImages: true, includeHeadersFooters: true, includeNotes: true);

                Console.WriteLine("✅ Dokument úspešne uložený: " + destPath);*/
                return 0;

                // 5) Ulož pomocou univerzálnej SaveInMemoryDocumentAsync metódy
                // Parametre: (doc, destPath, overwrite = true, includeImages = true, includeHeadersFooters = true, includeNotes = true)
                //****await WH.SaveInMemoryDocumentAsync(inMem, destPath, overwrite: true, includeImages: true, includeHeadersFooters: true, includeNotes: true);

                Console.WriteLine("✅ Dokument úspešne vytvorený a uložený: " + destPath);
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Chyba: " + ex.Message);
                Console.WriteLine(ex);
                return 1;
            }
        }

        public static async Task<string> WordRetAsync(InMemoryWordDocument doc, InMemoryWordDocument docPHH, DataRow dtrowInput, string string_date, string intitials, DataTable dtMapping, string destPath)
        {

            var replacements = new List<BookmarkReplacement>
            {
                new BookmarkReplacement { BookmarkName = "Table_Test1", NewText = "Testicek", Required = false },
                new BookmarkReplacement { BookmarkName = "Address", NewText = "Bratislava", Required = false },
                new BookmarkReplacement { BookmarkName = "NonExisting", NewText = "AAA", Required = false }
            };


            InMemoryWordDocument inMen = WH.ReplaceBookmarks(doc, replacements);

            // 3) Príprava dokumentu
            var preparedDoc = WH.Prepare(doc);

            // 4) Uloženie
            await WH.SaveInMemoryDocumentAsync(inMen, destPath, overwrite: true, includeImages: true, includeHeadersFooters: true, includeNotes: true);

            Console.WriteLine("✅ Dokument úspešne uložený: " + destPath);

            return @"Textik";
        }

        public static async Task<string> ChangeInputData(DataTable dtInput,string Typ, string fileFolder)
        {
            List<List<string>> mappingData = EH.ReadExcelRange(fileFolder + @"", @"mapping", @"A", 1,@"A",1);
            List<List<string>> listPodpisy = EH.ReadExcelRange(fileFolder + @"", @"mapping", @"A", 1, @"A", 1);
            List<List<string>> listInicialy = EH.ReadExcelRange(fileFolder + @"", @"mapping", @"A", 1, @"A", 1);
            List<List<string>> buildedMappingData =EH.BuildMappingSheet(1, mappingData);
            foreach (DataRow dtrowInput in dtInput.Rows) 
            {
                string komb;
                string segment;
                string fl;
                EH.ProcessMapping(mappingData, buildedMappingData, dtrowInput, Typ, 1, out komb, out segment, out fl);


            }
            return @"";
        }

            // ----------------------------
            // Spustenie externého procesu (pôvodný kód)
            // ----------------------------
            static Task<ProcessResult> StartExternalProcess(string exePath, string arguments)
        {
            var tcs = new TaskCompletionSource<ProcessResult>();

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = exePath,
                    Arguments = arguments,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                },
                EnableRaisingEvents = true
            };

            string output = "";
            string error = "";

            process.OutputDataReceived += (s, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    output += e.Data + Environment.NewLine;
            };

            process.ErrorDataReceived += (s, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                    error += e.Data + Environment.NewLine;
            };

            process.Exited += (s, e) =>
            {
                tcs.TrySetResult(new ProcessResult
                {
                    ExitCode = process.ExitCode,
                    Output = output,
                    Error = error
                });

                process.Dispose();
            };

            process.Start();
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();

            return tcs.Task;
        }
    }

    class ProcessResult
    {
        public int ExitCode { get; set; }
        public string Output { get; set; } = "";
        public string Error { get; set; } = "";
    }

    public class MappingItem
    {
        [JsonPropertyName("cast")]
        public string Cast { get; set; }

        [JsonPropertyName("segment")]
        public string Segment { get; set; }

        [JsonPropertyName("typ_fo")]
        public string TypFo { get; set; }

        [JsonPropertyName("typ_pracoviska")]
        public string TypPracoviska { get; set; }

        [JsonPropertyName("odbornosti")]
        public string Odbornosti { get; set; }

        [JsonPropertyName("validflag")]
        public string ValidFlag { get; set; }
    }

    public class MapSheetItem
    {
        public string Segment { get; set; }
        public string TypFo { get; set; }
        public string Mapping { get; set; }
        public string CastPrefix { get; set; }
        public string Cast { get; set; }
    }

}
