-- Migration: Add seating chart tables and data
-- Description: Create tables table and populate with wedding seating arrangements
-- Date: 2025-10-27

-- =====================================================
-- 1. TABLES TABLE (Seating Configuration)
-- =====================================================

CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number INTEGER UNIQUE NOT NULL,
  table_name TEXT,
  capacity INTEGER NOT NULL,
  position_x FLOAT, -- X coordinate for visual layout
  position_y FLOAT, -- Y coordinate for visual layout
  is_special BOOLEAN DEFAULT false, -- For head table, ceremony table, etc.
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tables_number ON tables(table_number);

-- =====================================================
-- 2. POPULATE TABLES DATA
-- =====================================================

-- Based on the venue layout provided
INSERT INTO tables (table_number, table_name, capacity, position_x, position_y, is_special, notes) VALUES
  (1, 'Mesa Grande', 6, 50, 20, true, 'Pais e noivos - Cortina de Pano'),
  (2, 'Mesa Cerimônia', 6, 30, 35, false, 'Próxima à mesa grande'),
  (3, 'Mesa 3', 6, 20, 50, false, 'Área central'),
  (4, 'Mesa 4', 5, 50, 50, false, 'Área central'),
  (5, 'Mesa 5', 6, 30, 75, false, 'Área inferior'),
  (6, 'Mesa 6', 5, 55, 75, false, 'Área inferior'),
  (7, 'Mesa 7', 6, 40, 85, false, 'Área inferior'),
  (8, 'Quarto Depósito', 0, 10, 65, true, 'Área de apoio');

-- =====================================================
-- 3. UPDATE INVITATIONS WITH TABLE ASSIGNMENTS
-- =====================================================

-- Mesa 1: Luiz Sobrinho, Elma Moreira, Helanio Rabelo, Socorro Rabelo, Ylana Rabelo, Hel Rabelo
UPDATE invitations SET table_number = 1 WHERE guest_name IN (
  'Luiz Sobrinho',
  'Elma Moreira',
  'Helanio Rabelo',
  'Socorro Rabelo',
  'Ylana Rabelo',
  'Hel Rabelo'
);

-- Mesa 2: Fláviana Campelo, Bruno Mendes, Isabella Campelo, Zé Flávio, Alex Pinheiro, Marilene Pinheiro
UPDATE invitations SET table_number = 2 WHERE guest_name IN (
  'Fláviana Campelo',
  'Bruno Mendes',
  'Isabella Campelo',
  'Zé Flávio',
  'Alex Pinheiro',
  'Marilene Pinheiro'
);

-- Mesa 3: Édson Luiz, Juliana Alves, Edna Martins, Adélia Martins, Davi Luiz, Luiz Gustavo
UPDATE invitations SET table_number = 3 WHERE guest_name IN (
  'Édson Luiz',
  'Juliana Alves',
  'Edna Martins',
  'Adélia Martins',
  'Davi Luiz',
  'Luiz Gustavo'
);

-- Mesa 4: Paulinha Rodrigues, Joel Lopes, Deyanne Ingrid, Érika Moreira, Ana Julia
UPDATE invitations SET table_number = 4 WHERE guest_name IN (
  'Paulinha Rodrigues',
  'Joel Lopes',
  'Deyanne Ingrid',
  'Érika Moreira',
  'Ana Julia'
);

-- Mesa 5: Renan Martins, Andressa Hora, Pedro Henrique, Sayara Bezerra, Rafael Hashimoto, Aline Hashimoto
UPDATE invitations SET table_number = 5 WHERE guest_name IN (
  'Renan Martins',
  'Andressa Hora',
  'Pedro Henrique',
  'Sayara Bezerra',
  'Rafael Hashimoto',
  'Aline Hashimoto'
);

-- Mesa 6: Luiz Filho, Patrícia Chaves, Lucas Saboya, Rafaella Marques, Morgana Pordeus
UPDATE invitations SET table_number = 6 WHERE guest_name IN (
  'Luiz Filho',
  'Patrícia Chaves',
  'Lucas Saboya',
  'Rafaella Marques',
  'Morgana Pordeus'
);

-- Mesa 7: Eduardo Mamud, Luciana Mamud, Danielle Lima, Welton de Sousa, Marcos Solan, Priscila Solan
UPDATE invitations SET table_number = 7 WHERE guest_name IN (
  'Eduardo Mamud',
  'Luciana Mamud',
  'Danielle Lima',
  'Welton de Sousa',
  'Marcos Solan',
  'Priscila Solan'
);

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Allow all users to read tables (needed for seating chart display)
CREATE POLICY "Allow public read access to tables"
  ON tables FOR SELECT
  USING (true);

-- Only admins can modify tables (handled by admin client)
CREATE POLICY "Allow admin full access to tables"
  ON tables FOR ALL
  USING (true);

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get guests at a specific table
CREATE OR REPLACE FUNCTION get_table_guests(target_table_number INTEGER)
RETURNS TABLE (
  guest_name TEXT,
  guest_email TEXT,
  plus_one_allowed BOOLEAN,
  plus_one_name TEXT,
  rsvp_completed BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.guest_name,
    i.guest_email,
    i.plus_one_allowed,
    i.plus_one_name,
    i.rsvp_completed
  FROM invitations i
  WHERE i.table_number = target_table_number
  ORDER BY i.guest_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all tables with guest counts
CREATE OR REPLACE FUNCTION get_tables_with_counts()
RETURNS TABLE (
  table_number INTEGER,
  table_name TEXT,
  capacity INTEGER,
  assigned_guests INTEGER,
  confirmed_guests INTEGER,
  position_x FLOAT,
  position_y FLOAT,
  is_special BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.table_number,
    t.table_name,
    t.capacity,
    COUNT(i.id)::INTEGER as assigned_guests,
    COUNT(CASE WHEN i.rsvp_completed = true THEN 1 END)::INTEGER as confirmed_guests,
    t.position_x,
    t.position_y,
    t.is_special
  FROM tables t
  LEFT JOIN invitations i ON i.table_number = t.table_number
  GROUP BY t.table_number, t.table_name, t.capacity, t.position_x, t.position_y, t.is_special
  ORDER BY t.table_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. UPDATE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tables_updated_at
  BEFORE UPDATE ON tables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
