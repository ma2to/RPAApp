using System;
using System.Data;
using System.Text.Json;

namespace RB0120.ApiRequestsHelper
{
    

    public static class ApiDataTableParser
    {
        public static List<DataTable> ParseApiResultToDataTables(string json)
        {
            var list = new List<DataTable>();
            using var doc = JsonDocument.Parse(json);

            if (doc.RootElement.ValueKind != JsonValueKind.Array)
                throw new Exception("API result must be an array of { name, data } objects.");

            foreach (var element in doc.RootElement.EnumerateArray())
            {
                string name = element.GetProperty("name").GetString() ?? "noname";
                string tableName = name;

                var dataElement = element.GetProperty("data");

                DataTable dt;

                if (dataElement.ValueKind == JsonValueKind.Array)
                {
                    dt = ConvertArrayToDataTable(dataElement, tableName);
                }
                else if (dataElement.ValueKind == JsonValueKind.Object)
                {
                    dt = ConvertObjectToDataTable(dataElement, tableName);
                }
                else
                {
                    // if Data = null or primitive
                    dt = new DataTable(tableName);
                    dt.Columns.Add("value");
                    dt.Rows.Add(dataElement.ToString());
                }

                list.Add(dt);
            }

            return list;
        }


        private static DataTable ConvertArrayToDataTable(JsonElement array, string tableName)
        {
            var dt = new DataTable(tableName);

            // create columns
            foreach (var item in array.EnumerateArray())
            {
                foreach (var prop in item.EnumerateObject())
                {
                    if (!dt.Columns.Contains(prop.Name))
                        dt.Columns.Add(prop.Name);
                }
            }

            // add rows
            foreach (var item in array.EnumerateArray())
            {
                var row = dt.NewRow();
                foreach (var prop in item.EnumerateObject())
                {
                    row[prop.Name] = prop.Value.ToString();
                }
                dt.Rows.Add(row);
            }

            return dt;
        }

        private static DataTable ConvertObjectToDataTable(JsonElement obj, string tableName)
        {
            var dt = new DataTable(tableName);

            foreach (var prop in obj.EnumerateObject())
            {
                dt.Columns.Add(prop.Name);
            }

            var row = dt.NewRow();
            foreach (var prop in obj.EnumerateObject())
            {
                row[prop.Name] = prop.Value.ToString();
            }

            dt.Rows.Add(row);

            return dt;
        }
    }

}
