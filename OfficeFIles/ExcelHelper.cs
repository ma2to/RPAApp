using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Data;
using System.Linq;
using System.Collections.Generic;

namespace RB0120.ExcelHelper
{
    internal class ExcelHelper
    {
        private static void ValidateExcelPath(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
                throw new ArgumentException("Cesta k súboru je prázdna.");

            if (Directory.Exists(filePath))
                throw new ArgumentException("Zadaná cesta je adresár, nie súbor.");

            if (!File.Exists(filePath))
                throw new FileNotFoundException("Súbor neexistuje.", filePath);

            if (!string.Equals(Path.GetExtension(filePath), ".xlsx", StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Súbor nie je .xlsx.");
        }

        private static int ColumnToNumber(string col)
        {
            if (int.TryParse(col, out int num))
                return num;

            int sum = 0;
            foreach (char c in col.ToUpper())
                sum = sum * 26 + (c - 'A' + 1);

            return sum;
        }


        private static int GetColumnIndex(string cellRef)
        {
            string col = new string(cellRef.Where(char.IsLetter).ToArray());
            return ColumnToNumber(col);
        }

        private static string GetCellReference(int row, int col)
        {
            string colName = "";
            while (col > 0)
            {
                col--;
                colName = (char)('A' + col % 26) + colName;
                col /= 26;
            }
            return colName + row;
        }

        private static string GetCellValue(WorkbookPart wbPart, Cell cell)
        {
            if (cell == null)
                return string.Empty;

            string value = cell.InnerText;

            if (cell.DataType?.Value == CellValues.SharedString)
                return wbPart.SharedStringTablePart
                    .SharedStringTable
                    .Elements<SharedStringItem>()
                    .ElementAt(int.Parse(value))
                    .InnerText;

            return value;
        }


        public static List<string> GetSheetNamesFromExcel(string filePath)
        {
            ValidateExcelPath(filePath);

            var sheetNames = new List<string>();

            // 4. otvorenie Excelu v read-only režime
            using (SpreadsheetDocument document = SpreadsheetDocument.Open(filePath, false))
            {
                WorkbookPart workbookPart = document.WorkbookPart;

                if (workbookPart?.Workbook?.Sheets == null)
                    throw new Exception("Excel súbor neobsahuje žiadne sheety.");

                // 5. čítanie názvov sheetov
                foreach (Sheet sheet in workbookPart.Workbook.Sheets)
                {
                    sheetNames.Add(sheet.Name);
                }
            }

            return sheetNames;
        }

        public static List<List<string>> ReadExcelRange(
            string filePath,
            string sheetName,
            string startColumn,
            int startRow,
            string columnForLastRow,
            int rowForLastColumn
        )
        {
            ValidateExcelPath(filePath);

            int startColIndex = ColumnToNumber(startColumn);
            int lastRowColIndex = ColumnToNumber(
                string.IsNullOrWhiteSpace(columnForLastRow)
                    ? startColumn
                    : columnForLastRow
            );

            int rowForLastCol = rowForLastColumn > 0 ? rowForLastColumn : startRow;

            var result = new List<List<string>>();

            using (SpreadsheetDocument doc = SpreadsheetDocument.Open(filePath, false))
            {
                WorkbookPart wbPart = doc.WorkbookPart;

                Sheet sheet = wbPart.Workbook.Sheets
                    .Elements<Sheet>()
                    .FirstOrDefault(s => s.Name == sheetName)
                    ?? throw new Exception($"Sheet '{sheetName}' neexistuje.");

                WorksheetPart wsPart = (WorksheetPart)wbPart.GetPartById(sheet.Id);
                SheetData sheetData = wsPart.Worksheet.GetFirstChild<SheetData>();

                // -------- last row (xlUp)
                int lastRow = sheetData.Elements<Row>()
                    .Where(r => r.RowIndex >= startRow &&
                                r.Elements<Cell>()
                                .Any(c => GetColumnIndex(c.CellReference) == lastRowColIndex &&
                                        !string.IsNullOrEmpty(c.InnerText)))
                    .Max(r => (int)r.RowIndex.Value);

                // -------- last column (xlToLeft)
                Row headerRow = sheetData.Elements<Row>()
                    .FirstOrDefault(r => r.RowIndex == rowForLastCol)
                    ?? throw new Exception($"Riadok {rowForLastCol} neexistuje.");

                int lastColumn = headerRow.Elements<Cell>()
                    .Where(c => GetColumnIndex(c.CellReference) >= startColIndex &&
                                !string.IsNullOrEmpty(c.InnerText))
                    .Max(c => GetColumnIndex(c.CellReference));

                // -------- read values (START → END)
                for (int r = startRow; r <= lastRow; r++)
                {
                    var rowValues = new List<string>();

                    Row row = sheetData.Elements<Row>()
                        .FirstOrDefault(x => x.RowIndex == r);

                    for (int c = startColIndex; c <= lastColumn; c++)
                    {
                        string cellRef = GetCellReference(r, c);
                        Cell cell = row?.Elements<Cell>()
                                        .FirstOrDefault(x => x.CellReference == cellRef);

                        rowValues.Add(GetCellValue(wbPart, cell));
                    }

                    result.Add(rowValues);
                }
            }

            return result;
        }

        public static List<List<string>> BuildMappingSheet(int StartIndex, List<List<string>> v)
        {
            var mapSheet = new List<List<string>>();

            // ak chceš zachovať rovnaké indexy ako VBA (1,2 prázdne)
            mapSheet.Add(new List<string> { "", "", "", "", "" });
            mapSheet.Add(new List<string> { "", "", "", "", "" });

            for (int i = StartIndex; i < v.Count; i++) // VBA i = 3
            {
                var row = v[i];

                string segment = row.ElementAtOrDefault(1) ?? "";
                string typFo = row.ElementAtOrDefault(2) ?? "";
                string typPracoviska = row.ElementAtOrDefault(3) ?? "";
                string prilohaFull = row.ElementAtOrDefault(0) ?? "";

                // -------- xlToLeft
                int lastColumnHelp = row.Count - 1;
                while (lastColumnHelp >= 4 && string.IsNullOrWhiteSpace(row[lastColumnHelp]))
                    lastColumnHelp--;

                // -------- kombinácie odbornosť + Y
                var sb = new System.Text.StringBuilder();

                for (int j = 4; j <= lastColumnHelp; j++) // VBA j = 5
                {
                    string odbornost = row[j];

                    if (!string.IsNullOrWhiteSpace(odbornost))
                    {
                        sb.Append(odbornost);
                        sb.Append(typPracoviska);
                        sb.Append(',');
                    }
                }

                // -------- časť názvu prílohy do bodky (vrátane bodky)
                string prilohaPart = "";
                int dotIndex = prilohaFull.IndexOf('.');
                if (dotIndex >= 0)
                    prilohaPart = prilohaFull.Substring(0, dotIndex + 1);

                mapSheet.Add(new List<string>
                {
                    segment,            // mapsheet(i, 1)
                    typFo,              // mapsheet(i, 2)
                    sb.ToString(),      // mapsheet(i, 3)
                    prilohaPart,        // mapsheet(i, 4)
                    prilohaFull         // mapsheet(i, 5)
                });
            }

            return mapSheet;
        }

        public static string Podpisy(List<List<string>> podpisujuci)
        {


            return @"";
        }

        public static void ProcessMapping(
            List<List<string>> mapping,
            List<List<string>> mapSheet,
            DataRow dtRowInput,
            string Typ,
            int StartIndex, //1
            out string komb,
            out string segment,
            out string FL
        )
        {
            komb = "";
            segment = "";
            FL = "";



            string dtInputKombinace = dtRowInput["KOMBINACE"]?.ToString() ?? "";
            string dtInputPHV = dtRowInput["PHV"]?.ToString() ?? "";

            for (int i = StartIndex; i < mapSheet.Count; i++) // VBA i = 3
            {
                string kombinacieRaw = mapSheet[i].ElementAtOrDefault(2) ?? "";
                if (string.IsNullOrWhiteSpace(kombinacieRaw))
                    continue;

                string[] kombinacie = kombinacieRaw.Split(',');

                foreach (string kombItem in kombinacie)
                {
                    if (string.IsNullOrWhiteSpace(kombItem))
                        continue;

                    // VBA: InStr(z(k - 8, 10), kombinace(j - 1))
                    if (!dtInputKombinace.Contains(kombItem))
                        continue;

                    // komb = komb & mapsheet(i, 4) & ","
                    komb += mapSheet[i][3] + ",";

                    // kontrola FINAN / ROZSAH
                    string fileNameLower =
                        (mapSheet[i].ElementAtOrDefault(4) ?? "").ToLowerInvariant();

                    if (!fileNameLower.Contains("finan") &&
                        !fileNameLower.Contains("rozsah"))
                    {
                        string seg = mapping[i].ElementAtOrDefault(1) ?? "";

                        if (string.IsNullOrEmpty(seg))
                        {
                            segment += ",";
                        }
                        else if (!segment.Contains(seg))
                        {
                            segment += seg + ",";
                        }
                    }

                    // FL = FL & v(i, 3) & ","
                    FL += (mapping[i].ElementAtOrDefault(2) ?? "") + ",";

                    break; // VBA Exit For
                }
            }

            // ---- PHV logika
            bool hasPHV = !string.IsNullOrWhiteSpace(dtInputPHV);

            if (Typ.Trim().ToLower() == @"ustavna")
            {

            }
            else if (Typ.Trim().ToLower() == @"ambulantna")
            { 
            
            }


            if (!komb.Contains("17.") && hasPHV)
                komb += "17.,26.";

            if (!komb.Contains("17.") && !hasPHV)
                komb = komb.Replace("17.", "");
        }




        public void WriteToExcel(string path, string sheetName, DataTable table)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentException("Cesta nebola zadana");

            path = NormalizePath(path);

            if (!File.Exists(path))
            {
                using var doc = SpreadsheetDocument.Create(path, SpreadsheetDocumentType.Workbook);
                var wbPart = doc.AddWorkbookPart();
                wbPart.Workbook = new Workbook();
                wbPart.AddNewPart<WorksheetPart>().Worksheet = new Worksheet(new SheetData());
                doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            }

            using var document = SpreadsheetDocument.Open(path, true);
            var workbookPart = document.WorkbookPart!;

            var wsPart = CreateOrGetSheet(workbookPart, sheetName);
            var sheetData = wsPart.Worksheet.GetFirstChild<SheetData>();

            // Zápis dát z DataTable
            foreach (DataRow dr in table.Rows)
            {
                Row row = new Row();

                foreach (var item in dr.ItemArray)
                {
                    var value = item?.ToString() ?? "";

                    row.Append(new Cell
                    {
                        DataType = CellValues.String,
                        CellValue = new CellValue(value)
                    });
                }

                sheetData.Append(row);
            }

            wsPart.Worksheet.Save();
        }

        public object ReadFromExcel(
            string? path,
            string? sheetName = null,
            string? range = null,
            string columnForLastRow = "A",
            int rowForLastColumn = 1
        )
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentException("Cesta nebola zadana");

            path = NormalizePath(path);

            using var document = SpreadsheetDocument.Open(path, false);
            var wb = document.WorkbookPart!;

            // výber sheetov
            IEnumerable<Sheet> sheets =
                sheetName == null
                    ? wb.Workbook.Sheets.OfType<Sheet>()                 // všetky
                    : wb.Workbook.Sheets.OfType<Sheet>().Where(s => s.Name == sheetName); // konkrétny

            // ak sheetName != null → vraciam 1 DataTable
            if (sheetName != null)
            {
                Sheet sheet = sheets.First();
                return ReadSingleSheet(wb, sheet, range, columnForLastRow, rowForLastColumn);
            }

            // ak sheetName == null → vraciam Dictionary<string, DataTable>
            var result = new Dictionary<string, DataTable>();

            foreach (var sheet in sheets)
            {
                var table = ReadSingleSheet(wb, sheet, range, columnForLastRow, rowForLastColumn);
                result[sheet.Name!] = table;
            }

            return result;
        }

        private DataTable ReadSingleSheet(
            WorkbookPart wb,
            Sheet sheet,
            string? range,
            string columnForLastRow,
            int rowForLastColumn)
        {
            var wsPart = (WorksheetPart)wb.GetPartById(sheet.Id!);
            var sheetData = wsPart.Worksheet.GetFirstChild<SheetData>();

            // auto-range ak nie je definované
            string effectiveRange = range ?? DetectRange(sheetData, columnForLastRow, rowForLastColumn);
            var parsed = ParseRange(effectiveRange);

            var dt = new DataTable(sheet.Name!);

            // vygenerujeme stĺpce podľa šírky rozsahu
            int columnCount = parsed.endCol - parsed.startCol + 1;
            for (int i = 0; i < columnCount; i++)
                dt.Columns.Add($"Col{i + 1}");

            // načítanie riadkov
            foreach (Row row in sheetData.Elements<Row>()
                              .Where(r => r.RowIndex >= parsed.startRow && r.RowIndex <= parsed.endRow))
            {
                var dataRow = dt.NewRow();

                foreach (Cell cell in row.Elements<Cell>())
                {
                    string colName = GetColumnName(cell.CellReference!);
                    int colIndex = ColumnNameToIndex(colName);

                    if (colIndex < parsed.startCol || colIndex > parsed.endCol)
                        continue; // mimo rozsahu

                    int dtCol = colIndex - parsed.startCol; // posun do DataTable

                    dataRow[dtCol] = string.IsNullOrEmpty(cell.InnerText)
                        ? DBNull.Value
                        : cell.InnerText;
                }

                dt.Rows.Add(dataRow);
            }

            return dt;
        }

        private string DetectRange(SheetData sheetData, string colForLastRow, int rowForLastColumn)
        {
            var rows = sheetData.Elements<Row>().ToList();

            if (!rows.Any())
                return "A1:A1";

            int checkColumn = ColumnNameToIndex(colForLastRow);

            // 1) Posledný neprázdny riadok podľa daného stĺpca
            uint lastRow =
                rows.Where(r => r.Elements<Cell>()
                                  .Any(c => ColumnNameToIndex(GetColumnName(c.CellReference!)) == checkColumn
                                            && !string.IsNullOrWhiteSpace(c.InnerText)))
                    .Select(r => r.RowIndex!.Value)
                    .DefaultIfEmpty((uint)1)    // FIX
                    .Max();

            // 2) Posledný neprázdny stĺpec podľa daného riadku
            Row? checkRow = rows.FirstOrDefault(r => r.RowIndex == rowForLastColumn);

            int lastCol =
                checkRow?.Elements<Cell>()
                    .Where(c => !string.IsNullOrWhiteSpace(c.InnerText))
                    .Select(c => ColumnNameToIndex(GetColumnName(c.CellReference!)))
                    .DefaultIfEmpty(1)          // OK - IEnumerable<int>
                    .Max()
                ?? 1;

            return $"A1:{IndexToColumnName(lastCol)}{lastRow}";
        }


        private WorksheetPart CreateOrGetSheet(WorkbookPart wbPart, string sheetName)
        {
            var sheets = wbPart.Workbook.Sheets!;

            var existing = sheets.OfType<Sheet>().FirstOrDefault(s => s.Name == sheetName);
            if (existing != null)
                return (WorksheetPart)wbPart.GetPartById(existing.Id!);

            uint newId = sheets.Elements<Sheet>()
                               .Select(s => s.SheetId!.Value)
                               .DefaultIfEmpty((uint)0)   // FIX
                               .Max() + 1;

            var wsPart = wbPart.AddNewPart<WorksheetPart>();
            wsPart.Worksheet = new Worksheet(new SheetData());

            var newSheet = new Sheet
            {
                Id = wbPart.GetIdOfPart(wsPart),
                SheetId = newId,
                Name = sheetName
            };

            sheets.Append(newSheet);
            wbPart.Workbook.Save();

            return wsPart;
        }


        private (int startCol, int startRow, int endCol, int endRow) ParseRange(string range)
        {
            var parts = range.Split(':');

            var (sc, sr) = ParseCell(parts[0]);
            var (ec, er) = ParseCell(parts[1]);

            return (sc, sr, ec, er);
        }

        private (int col, int row) ParseCell(string cell)
        {
            string col = new string(cell.Where(char.IsLetter).ToArray());
            string row = new string(cell.Where(char.IsDigit).ToArray());

            return (ColumnNameToIndex(col), int.Parse(row));
        }

        private string GetColumnName(string cellReference)
        {
            return new string(cellReference.Where(char.IsLetter).ToArray());
        }

        private int ColumnNameToIndex(string columnName)
        {
            int result = 0;

            foreach (char c in columnName)
            {
                result *= 26;
                result += (c - 'A' + 1);
            }

            return result;
        }

        private string IndexToColumnName(int index)
        {
            string result = "";

            while (index > 0)
            {
                int mod = (index - 1) % 26;
                result = (char)('A' + mod) + result;
                index = (index - mod) / 26;
            }

            return result;
        }

        private string NormalizePath(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentException("Cesta k súboru nesmie byť prázdna.");

            string directory = Path.GetDirectoryName(path) ?? "";
            string file = Path.GetFileName(path);

            if (string.IsNullOrWhiteSpace(file))
                throw new ArgumentException("Cesta neobsahuje názov súboru.");

            // Ak chýba prípona → pridáme .xlsx
            if (!file.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase) &&
                !file.EndsWith(".xls", StringComparison.OrdinalIgnoreCase))
            {
                file += ".xlsx";
                path = Path.Combine(directory, file);
            }

            return path;
        }




    }
}
