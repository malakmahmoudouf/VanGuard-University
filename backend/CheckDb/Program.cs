using System;
using System.Data;
using Npgsql;

var connString = "Host=localhost;Port=5432;Database=course_db;Username=postgres;Password=0000";

using var conn = new NpgsqlConnection(connString);
conn.Open();

Console.WriteLine("Connected to course_db");
Console.WriteLine();

using var tablesCmd = new NpgsqlCommand(@"
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;", conn);

using var tablesReader = tablesCmd.ExecuteReader();
var tables = new List<string>();

while (tablesReader.Read())
{
    tables.Add(tablesReader.GetString(0));
}

tablesReader.Close();

foreach (var tableName in tables)
{
    Console.WriteLine($"== {tableName} ==");

    using var dataCmd = new NpgsqlCommand($"SELECT * FROM public.\"{EscapeIdentifier(tableName)}\" LIMIT 5;", conn);
    using var reader = dataCmd.ExecuteReader();

    if (reader.FieldCount == 0)
    {
        Console.WriteLine("(no columns)");
        Console.WriteLine();
        continue;
    }

    for (var i = 0; i < reader.FieldCount; i++)
    {
        Console.Write(reader.GetName(i));
        if (i < reader.FieldCount - 1)
        {
            Console.Write(" | ");
        }
    }

    Console.WriteLine();

    var hasRows = false;
    while (reader.Read())
    {
        hasRows = true;

        for (var i = 0; i < reader.FieldCount; i++)
        {
            var value = reader.IsDBNull(i) ? "NULL" : reader.GetValue(i)?.ToString();
            Console.Write(value);
            if (i < reader.FieldCount - 1)
            {
                Console.Write(" | ");
            }
        }

        Console.WriteLine();
    }

    if (!hasRows)
    {
        Console.WriteLine("(no rows)");
    }

    Console.WriteLine();
}

static string EscapeIdentifier(string identifier)
{
    return identifier.Replace("\"", "\"\"");
}
