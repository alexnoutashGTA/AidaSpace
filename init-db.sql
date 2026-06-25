IF DB_ID(N'AidaSpace') IS NULL
BEGIN
    CREATE DATABASE AidaSpace;
END
GO

USE AidaSpace;
GO

IF OBJECT_ID(N'dbo.Address', 'U') IS NOT NULL
    DROP TABLE dbo.Address;
GO
CREATE TABLE dbo.Address (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Street NVARCHAR(200) NULL,
    City NVARCHAR(100) NULL,
    StateProvince NVARCHAR(100) NULL,
    Zip NVARCHAR(50) NULL,
    Country NVARCHAR(100) NULL
);
GO

IF OBJECT_ID(N'dbo.BirthInfo', 'U') IS NOT NULL
    DROP TABLE dbo.BirthInfo;
GO
CREATE TABLE dbo.BirthInfo (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FullName NVARCHAR(100) NULL,
    Gender NVARCHAR(50) NULL,
    Age INT NULL,
    Comments NVARCHAR(MAX) NULL,
    Retired NVARCHAR(50) NULL
);
GO

IF OBJECT_ID(N'dbo.Information', 'U') IS NOT NULL
    DROP TABLE dbo.Information;
GO
CREATE TABLE dbo.Information (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NULL,
    AgeDescription NVARCHAR(100) NULL,
    Address NVARCHAR(300) NULL,
    Phone NVARCHAR(50) NULL,
    Company NVARCHAR(200) NULL,
    Occupation NVARCHAR(200) NULL,
    Notes NVARCHAR(MAX) NULL
);
GO
