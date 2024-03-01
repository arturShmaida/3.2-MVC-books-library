SELECT EXISTS (
  SELECT *
  FROM information_schema.tables
  WHERE `table_schema` = ?
    AND `table_name` = ?
);