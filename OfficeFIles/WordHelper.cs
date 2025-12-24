using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RB0120.WordHelper
{
    public class WordHelper
    {
        // ----------------------------
        // Základné utility
        // ----------------------------
        public static string EnsureDocxPath(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
                throw new ArgumentException("filePath nesmie byť prázdny.", nameof(filePath));

            string fullPath = Path.GetFullPath(filePath);
            string extension = Path.GetExtension(fullPath);

            if (string.IsNullOrEmpty(extension))
            {
                fullPath += ".docx";
            }
            else if (!extension.Equals(".docx", StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException($"Neplatná prípona súboru: {extension}. Očakáva sa .docx", nameof(filePath));
            }

            return fullPath;
        }

        // ----------------------------
        // Načítanie Word dokumentu do pamäte
        // ----------------------------
        public static async Task<InMemoryWordDocument> LoadWordDocumentAsync(string filePath)
        {
            string normalizedPath = EnsureDocxPath(filePath);

            if (!File.Exists(normalizedPath))
                throw new FileNotFoundException($"Súbor neexistuje: {normalizedPath}", normalizedPath);

            return await Task.Run(() =>
            {
                using var wordDoc = WordprocessingDocument.Open(normalizedPath, false);
                var mainPart = wordDoc.MainDocumentPart ?? throw new InvalidOperationException("Dokument neobsahuje MainDocumentPart.");
                var result = new InMemoryWordDocument
                {
                    RootDocument = (Document)mainPart.Document.CloneNode(true),
                    Body = (Body)mainPart.Document.Body.CloneNode(true),
                    Settings = mainPart.DocumentSettingsPart?.Settings != null ? (Settings)mainPart.DocumentSettingsPart.Settings.CloneNode(true) : null,
                    Styles = mainPart.StyleDefinitionsPart?.Styles != null ? (Styles)mainPart.StyleDefinitionsPart.Styles.CloneNode(true) : null,
                    Numbering = mainPart.NumberingDefinitionsPart?.Numbering != null ? (Numbering)mainPart.NumberingDefinitionsPart.Numbering.CloneNode(true) : null,
                    Theme = mainPart.ThemePart?.Theme != null ? (DocumentFormat.OpenXml.Drawing.Theme)mainPart.ThemePart.Theme.CloneNode(true) : null,
                    WebSettings = mainPart.WebSettingsPart?.WebSettings != null ? (WebSettings)mainPart.WebSettingsPart.WebSettings.CloneNode(true) : null
                };

                // SectionProperties
                result.SectionPropertiesList = mainPart.Document.Body.Elements<Paragraph>()
                    .Select(p => p.Elements<ParagraphProperties>().FirstOrDefault()?.Elements<SectionProperties>().FirstOrDefault())
                    .Where(sp => sp != null)
                    .Select(sp => (SectionProperties)sp.CloneNode(true))
                    .ToList();

                // Headers/Footers
                result.HeadersByRelId = mainPart.HeaderParts
                    .Select(hp => new { rid = mainPart.GetIdOfPart(hp), header = (Header)hp.Header.CloneNode(true) })
                    .Where(x => !string.IsNullOrEmpty(x.rid))
                    .ToDictionary(x => x.rid, x => x.header, StringComparer.OrdinalIgnoreCase);

                result.FootersByRelId = mainPart.FooterParts
                    .Select(fp => new { rid = mainPart.GetIdOfPart(fp), footer = (Footer)fp.Footer.CloneNode(true) })
                    .Where(x => !string.IsNullOrEmpty(x.rid))
                    .ToDictionary(x => x.rid, x => x.footer, StringComparer.OrdinalIgnoreCase);

                // Bookmarks
                result.Bookmarks = mainPart.Document.Body.Descendants<BookmarkStart>()
                    .Select(b =>
                    {
                        BookmarkEnd end = b.Parent?.Descendants<BookmarkEnd>().FirstOrDefault(e => e.Id == b.Id)
                                          ?? mainPart.Document.Body.Descendants<BookmarkEnd>().FirstOrDefault(e => e.Id == b.Id);
                        return new BookmarkInfo
                        {
                            Id = b.Id?.Value,
                            Name = b.Name?.Value,
                            StartElement = (BookmarkStart)b.CloneNode(true),
                            EndElement = end != null ? (BookmarkEnd)end.CloneNode(true) : null
                        };
                    }).ToList();

                // Comments
                if (mainPart.WordprocessingCommentsPart?.Comments != null)
                    result.Comments = mainPart.WordprocessingCommentsPart.Comments.Elements<Comment>().Select(c => (Comment)c.CloneNode(true)).ToList();

                // Images
                result.ImagesByRelId = new Dictionary<string, ImageData>();
                foreach (var imgPart in mainPart.ImageParts)
                {
                    string relId = mainPart.GetIdOfPart(imgPart);
                    using var ms = new MemoryStream();
                    imgPart.GetStream().CopyTo(ms);
                    result.ImagesByRelId[relId] = new ImageData
                    {
                        Content = ms.ToArray(),
                        ContentType = imgPart.ContentType,
                        Uri = imgPart.Uri,
                        RelId = relId
                    };
                }

                // Footnotes/Endnotes
                if (mainPart.FootnotesPart?.Footnotes != null)
                    result.Footnotes = (Footnotes)mainPart.FootnotesPart.Footnotes.CloneNode(true);
                if (mainPart.EndnotesPart?.Endnotes != null)
                    result.Endnotes = (Endnotes)mainPart.EndnotesPart.Endnotes.CloneNode(true);

                // Custom XML
                result.CustomXmlParts = mainPart.CustomXmlParts.Select(p =>
                {
                    using var ms = new MemoryStream();
                    p.GetStream().CopyTo(ms);
                    return new CustomXmlPartData { Content = Encoding.UTF8.GetString(ms.ToArray()), Uri = p.Uri, PartType = p.ContentType };
                }).ToList();

                // Embedded packages
                result.EmbeddedPackageParts = mainPart.EmbeddedPackageParts.Select(p =>
                {
                    using var ms = new MemoryStream();
                    p.GetStream().CopyTo(ms);
                    return new EmbeddedPackagePartData { Content = ms.ToArray(), Uri = p.Uri, ContentType = p.ContentType, PartName = p.Uri.Segments.Last() };
                }).ToList();

                // Core properties
                var cp = wordDoc.PackageProperties;
                result.CoreProperties = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                void AddIfNotNull(string key, string val)
                {
                    if (!string.IsNullOrEmpty(val)) result.CoreProperties[key] = val;
                }
                AddIfNotNull("Title", cp.Title);
                AddIfNotNull("Creator", cp.Creator);
                AddIfNotNull("Subject", cp.Subject);
                AddIfNotNull("Description", cp.Description);
                AddIfNotNull("Keywords", cp.Keywords);
                AddIfNotNull("LastModifiedBy", cp.LastModifiedBy);
                AddIfNotNull("Revision", cp.Revision);

                return result;
            });
        }

        // ----------------------------
        // Načítanie viacerých dokumentov naraz
        // ----------------------------
        public static async Task<Dictionary<string, LoadedWordResult>> LoadMultipleDocumentsAsync(Dictionary<string, string> fileMap)
        {
            if (fileMap == null)
                throw new ArgumentNullException(nameof(fileMap));

            var result = new Dictionary<string, LoadedWordResult>(StringComparer.OrdinalIgnoreCase);
            foreach (var kv in fileMap)
            {
                var item = new LoadedWordResult { Path = kv.Value };
                try
                {
                    item.Document = await LoadWordDocumentAsync(kv.Value);
                    item.Status = "OK";
                }
                catch (Exception ex)
                {
                    item.Status = "NOK";
                    item.ErrorMessage = ex.Message;
                }
                result[kv.Key] = item;
            }
            return result;
        }

        // ----------------------------
        // Príprava dokumentu na zápis (Apply)
        // ----------------------------
        public static PreparedWordPackage Prepare(InMemoryWordDocument doc)
        {
            var pkg = new PreparedWordPackage
            {
                Document = (Document)doc.RootDocument.CloneNode(true),
                Settings = doc.Settings != null ? (Settings)doc.Settings.CloneNode(true) : null,
                Styles = doc.Styles != null ? (Styles)doc.Styles.CloneNode(true) : null,
                Numbering = doc.Numbering != null ? (Numbering)doc.Numbering.CloneNode(true) : null,
                Theme = doc.Theme != null ? (DocumentFormat.OpenXml.Drawing.Theme)doc.Theme.CloneNode(true) : null,
                WebSettings = doc.WebSettings != null ? (WebSettings)doc.WebSettings.CloneNode(true) : null,
                FontTableXml = doc.FontTableXml,
                Headers = doc.HeadersByRelId?.ToDictionary(kv => kv.Key, kv => (Header)kv.Value.CloneNode(true)) ?? new(),
                Footers = doc.FootersByRelId?.ToDictionary(kv => kv.Key, kv => (Footer)kv.Value.CloneNode(true)) ?? new(),
                HeaderIdMap = new Dictionary<string, string>(),
                FooterIdMap = new Dictionary<string, string>(),
                Images = doc.ImagesByRelId?.ToDictionary(kv => kv.Key, kv => kv.Value) ?? new(),
                ImageIdMap = new Dictionary<string, string>(),
                CustomXmlParts = doc.CustomXmlParts?.ToList() ?? new(),
                EmbeddedPackages = doc.EmbeddedPackageParts?.ToList() ?? new(),
                Footnotes = doc.Footnotes != null ? (Footnotes)doc.Footnotes.CloneNode(true) : null,
                Endnotes = doc.Endnotes != null ? (Endnotes)doc.Endnotes.CloneNode(true) : null,
                CoreProperties = doc.CoreProperties
            };
            return pkg;
        }



        public static async Task SaveInMemoryDocumentAsync(
    InMemoryWordDocument doc,
    string destPath,
    bool overwrite = true,
    bool includeImages = true,
    bool includeHeadersFooters = true,
    bool includeNotes = true)
        {
            if (doc == null) throw new ArgumentNullException(nameof(doc));
            if (string.IsNullOrWhiteSpace(destPath)) throw new ArgumentException("destPath nesmie byť prázdny.");

            string fullPath = EnsureDocxPath(destPath);

            if (File.Exists(fullPath))
            {
                if (!overwrite) throw new IOException("Súbor už existuje a overwrite = false.");
                File.Delete(fullPath);
            }

            await Task.Run(() =>
            {
                using (var wordDoc = WordprocessingDocument.Create(fullPath, WordprocessingDocumentType.Document))
                {
                    var mainPart = wordDoc.AddMainDocumentPart();

                    // ----------------------------
                    // Dokument a Body
                    // ----------------------------
                    mainPart.Document = (Document)doc.RootDocument.CloneNode(true);

                    // ----------------------------
                    // Styles
                    // ----------------------------
                    if (doc.Styles != null)
                    {
                        var stylesPart = mainPart.AddNewPart<StyleDefinitionsPart>();
                        stylesPart.Styles = (Styles)doc.Styles.CloneNode(true);
                    }

                    // ----------------------------
                    // Settings
                    // ----------------------------
                    if (doc.Settings != null)
                    {
                        var settingsPart = mainPart.AddNewPart<DocumentSettingsPart>();
                        settingsPart.Settings = (Settings)doc.Settings.CloneNode(true);
                    }

                    // ----------------------------
                    // Numbering
                    // ----------------------------
                    if (doc.Numbering != null)
                    {
                        var numberingPart = mainPart.AddNewPart<NumberingDefinitionsPart>();
                        numberingPart.Numbering = (Numbering)doc.Numbering.CloneNode(true);
                    }

                    // ----------------------------
                    // Headers
                    // ----------------------------
                    var headerRelMap = new Dictionary<string, string>();
                    if (includeHeadersFooters && doc.HeadersByRelId != null)
                    {
                        foreach (var kv in doc.HeadersByRelId)
                        {
                            var headerPart = mainPart.AddNewPart<HeaderPart>();
                            headerPart.Header = (Header)kv.Value.CloneNode(true);

                            string newId = mainPart.GetIdOfPart(headerPart);
                            headerRelMap[kv.Key] = newId;
                        }
                    }

                    // ----------------------------
                    // Footers
                    // ----------------------------
                    var footerRelMap = new Dictionary<string, string>();
                    if (includeHeadersFooters && doc.FootersByRelId != null)
                    {
                        foreach (var kv in doc.FootersByRelId)
                        {
                            var footerPart = mainPart.AddNewPart<FooterPart>();
                            footerPart.Footer = (Footer)kv.Value.CloneNode(true);

                            string newId = mainPart.GetIdOfPart(footerPart);
                            footerRelMap[kv.Key] = newId;
                        }
                    }

                    // ----------------------------
                    // Images
                    // ----------------------------
                    var imageRelMap = new Dictionary<string, string>();

                    if (includeImages && doc.ImagesByRelId != null)
                    {
                        foreach (var kv in doc.ImagesByRelId)
                        {
                            var imgPart = mainPart.AddImagePart(kv.Value.ContentType);

                            using var ms = new MemoryStream(kv.Value.Content);
                            imgPart.FeedData(ms);

                            string newRelId = mainPart.GetIdOfPart(imgPart);
                            imageRelMap[kv.Key] = newRelId;
                        }
                    }

                    // ----------------------------
                    // Footnotes / Endnotes
                    // ----------------------------
                    if (includeNotes)
                    {
                        if (doc.Footnotes != null)
                        {
                            var footnotesPart = mainPart.AddNewPart<FootnotesPart>();
                            footnotesPart.Footnotes = (Footnotes)doc.Footnotes.CloneNode(true);
                        }

                        if (doc.Endnotes != null)
                        {
                            var endnotesPart = mainPart.AddNewPart<EndnotesPart>();
                            endnotesPart.Endnotes = (Endnotes)doc.Endnotes.CloneNode(true);
                        }
                    }

                    // ----------------------------
                    // OPRAVA relácií v XML (rId)
                    // ----------------------------

                    // Obrázky v hlavnom dokumente
                    foreach (var blip in mainPart.Document
                        .Descendants<DocumentFormat.OpenXml.Drawing.Blip>())
                    {
                        if (blip.Embed != null &&
                            imageRelMap.TryGetValue(blip.Embed.Value, out var newId))
                        {
                            blip.Embed.Value = newId;
                        }
                    }

                    // Headers - obrázky
                    foreach (var hp in mainPart.HeaderParts)
                    {
                        foreach (var blip in hp.Header.Descendants<DocumentFormat.OpenXml.Drawing.Blip>())
                        {
                            if (blip.Embed != null &&
                                imageRelMap.TryGetValue(blip.Embed.Value, out var newId))
                            {
                                blip.Embed.Value = newId;
                            }
                        }
                    }

                    // Footers - obrázky
                    foreach (var fp in mainPart.FooterParts)
                    {
                        foreach (var blip in fp.Footer.Descendants<DocumentFormat.OpenXml.Drawing.Blip>())
                        {
                            if (blip.Embed != null &&
                                imageRelMap.TryGetValue(blip.Embed.Value, out var newId))
                            {
                                blip.Embed.Value = newId;
                            }
                        }
                    }

                    // Headers - relId
                    foreach (var refEl in mainPart.Document.Descendants<HeaderReference>())
                    {
                        if (refEl.Id != null &&
                            headerRelMap.TryGetValue(refEl.Id.Value, out var newId))
                        {
                            refEl.Id.Value = newId;
                        }
                    }

                    // Footers - relId
                    foreach (var refEl in mainPart.Document.Descendants<FooterReference>())
                    {
                        if (refEl.Id != null &&
                            footerRelMap.TryGetValue(refEl.Id.Value, out var newId))
                        {
                            refEl.Id.Value = newId;
                        }
                    }

                    // ----------------------------
                    // Save
                    // ----------------------------
                    mainPart.Document.Save();
                }
            });
        }



        // ----------------------------
        // Nahradenie textu v bookmarku
        // ----------------------------
        public static void ReplaceBookmark(InMemoryWordDocument doc, string bookmarkName, string newText, bool required=false)
        {
            if (doc?.Body == null)
                throw new ArgumentNullException(nameof(doc), "InMemoryWordDocument nesmie byť null.");

            if (string.IsNullOrWhiteSpace(bookmarkName))
                throw new ArgumentException("Bookmark name nesmie byť prázdny.", nameof(bookmarkName));

            var bookmarkStart = doc.Body
                .Descendants<BookmarkStart>()
                .FirstOrDefault(b => string.Equals(b.Name?.Value, bookmarkName, StringComparison.OrdinalIgnoreCase));

            if (bookmarkStart == null)
            {
                if (required)
                    throw new InvalidOperationException($"Required bookmark '{bookmarkName}' nebol nájdený v dokumente.");
                return;
            }

            var bookmarkEnd = doc.Body
                .Descendants<BookmarkEnd>()
                .FirstOrDefault(b => b.Id == bookmarkStart.Id);

            if (bookmarkEnd == null)
            {
                if (required)
                    throw new InvalidOperationException($"Bookmark '{bookmarkName}' má start tag, ale nemá end tag.");
                return;
            }

            // 1) Vymažeme všetko medzi bookmarkStart a bookmarkEnd
            var toRemove = new List<OpenXmlElement>();
            var current = bookmarkStart.NextSibling();

            while (current != null && current != bookmarkEnd)
            {
                toRemove.Add(current);
                current = current.NextSibling();
            }

            foreach (var el in toRemove)
                el.Remove();

            // 2) Pridáme nový text
            var run = new Run(new Text(newText) { Space = SpaceProcessingModeValues.Preserve });
            bookmarkStart.Parent.InsertAfter(run, bookmarkStart);
        }


        // ----------------------------
        // Vykonanie hromadného nahradenia
        // ----------------------------
        public static InMemoryWordDocument ReplaceBookmarks(InMemoryWordDocument doc,IEnumerable<BookmarkReplacement> replacements)
        {
            if (doc == null)
                throw new ArgumentNullException(nameof(doc), "InMemoryWordDocument nesmie byť null.");

            if (replacements == null)
                throw new ArgumentNullException(nameof(replacements), "Zoznam replacements nesmie byť null.");

            foreach (var item in replacements)
            {
                if (item == null)
                    throw new ArgumentException("Položka zoznamu replacements nesmie byť null.");

                ReplaceBookmark(doc, item.BookmarkName, item.NewText ?? string.Empty, item.Required);
            }

            return doc;
        }


        public static Table FindTableByBookmark(InMemoryWordDocument doc, string bookmarkName)
        {
            if (doc?.Body == null || string.IsNullOrWhiteSpace(bookmarkName))
                return null;

            // 1) Nájdeme bookmarkStart
            var bookmarkStart = doc.Body
                .Descendants<BookmarkStart>()
                .FirstOrDefault(b => string.Equals(b.Name?.Value, bookmarkName, StringComparison.OrdinalIgnoreCase));

            if (bookmarkStart == null)
                return null;

            // 2) Stúpame hore stromom až kým nenájdeme Table
            OpenXmlElement current = bookmarkStart;

            while (current != null)
            {
                if (current is Table table)
                    return table;

                current = current.Parent;
            }

            return null; // bookmark nie je v tabuľke
        }

    }

    // ----------------------------
    // Podporné dátové štruktúry
    // ----------------------------
    public class InMemoryWordDocument
    {
        public Document RootDocument { get; set; }
        public Body Body { get; set; }
        public Settings Settings { get; set; }
        public List<SectionProperties> SectionPropertiesList { get; set; } = new List<SectionProperties>();
        public Dictionary<string, Header> HeadersByRelId { get; set; } = new Dictionary<string, Header>(StringComparer.OrdinalIgnoreCase);
        public Dictionary<string, Footer> FootersByRelId { get; set; } = new Dictionary<string, Footer>(StringComparer.OrdinalIgnoreCase);
        public List<BookmarkInfo> Bookmarks { get; set; } = new List<BookmarkInfo>();
        public Styles Styles { get; set; }
        public Numbering Numbering { get; set; }
        public Footnotes Footnotes { get; set; }
        public Endnotes Endnotes { get; set; }
        public List<Comment> Comments { get; set; } = new List<Comment>();
        public Dictionary<string, ImageData> ImagesByRelId { get; set; } = new Dictionary<string, ImageData>();
        public DocumentFormat.OpenXml.Drawing.Theme Theme { get; set; }
        public WebSettings WebSettings { get; set; }
        public string FontTableXml { get; set; }
        public List<CustomXmlPartData> CustomXmlParts { get; set; } = new List<CustomXmlPartData>();
        public List<EmbeddedPackagePartData> EmbeddedPackageParts { get; set; } = new List<EmbeddedPackagePartData>();
        public Dictionary<string, string> CoreProperties { get; set; } = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    }

    public class BookmarkInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public BookmarkStart StartElement { get; set; }
        public BookmarkEnd EndElement { get; set; }
    }

    public class ImageData
    {
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
        public Uri Uri { get; set; }
        public string RelId { get; set; }
    }

    public class CustomXmlPartData
    {
        public string Content { get; set; }
        public Uri Uri { get; set; }
        public string PartType { get; set; }
    }

    public class EmbeddedPackagePartData
    {
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
        public Uri Uri { get; set; }
        public string PartName { get; set; }
    }

    public class LoadedWordResult
    {
        public string Path { get; set; }
        public InMemoryWordDocument Document { get; set; }
        public string Status { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class BookmarkReplacement
    {
        public string BookmarkName { get; set; }
        public string NewText { get; set; }
        public bool Required { get; set; }
    }


    public class PreparedWordPackage
    {
        public Document Document { get; set; }
        public Settings Settings { get; set; }
        public Styles Styles { get; set; }
        public Numbering Numbering { get; set; }
        public DocumentFormat.OpenXml.Drawing.Theme Theme { get; set; }
        public WebSettings WebSettings { get; set; }
        public string FontTableXml { get; set; }
        public Dictionary<string, Header> Headers { get; set; } = new();
        public Dictionary<string, Footer> Footers { get; set; } = new();
        public Dictionary<string, string> HeaderIdMap { get; set; } = new();
        public Dictionary<string, string> FooterIdMap { get; set; } = new();
        public Dictionary<string, ImageData> Images { get; set; } = new();
        public Dictionary<string, string> ImageIdMap { get; set; } = new();
        public List<CustomXmlPartData> CustomXmlParts { get; set; } = new();
        public List<EmbeddedPackagePartData> EmbeddedPackages { get; set; } = new();
        public Footnotes Footnotes { get; set; }
        public Endnotes Endnotes { get; set; }
        public IEnumerable<KeyValuePair<string, string>> CoreProperties { get; set; }
    }
}
