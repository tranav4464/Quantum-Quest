-- FinSight Phase 2 Database Initialization
-- PostgreSQL initialization script for development

-- Create additional databases if needed
CREATE DATABASE finsight_test;

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'UTC';
