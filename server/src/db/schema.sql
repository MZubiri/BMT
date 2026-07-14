-- Base de Datos para BMT (Batallón Militar Táctico)

CREATE TABLE IF NOT EXISTS group_ranks (
  badge_code VARCHAR(255) PRIMARY KEY,
  rank_name VARCHAR(100) NOT NULL,
  role_name ENUM('OWNER', 'OFFICER', 'MEMBER') DEFAULT 'MEMBER'
);

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  unique_id VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('OWNER', 'OFFICER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
  figure VARCHAR(255) NOT NULL,
  rank_name VARCHAR(100) DEFAULT 'Grumete',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  week_minutes INT DEFAULT 0,
  total_minutes INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS active_duties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  started_at TIMESTAMP NULL DEFAULT NULL,
  accrued_ms BIGINT DEFAULT 0,
  status ENUM('running', 'paused') NOT NULL DEFAULT 'running',
  note VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS duty_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  minutes INT NOT NULL,
  note VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Seed Data para Configuración de Rangos por Placas de Habbo.es
INSERT INTO group_ranks (badge_code, rank_name, role_name) VALUES
('b09054s02135s36047s44054t27114cd31c00da2fd4753e88e344a7723ff14', 'Grumete', 'MEMBER'),
('b09024s02135s36047s44024t271148598db7ba6558ee51c564e76ef038622', 'Cabo', 'MEMBER'),
('b09104s02135s36047s44104t2711491934527c2d1d1e021e0a14fce6a11f7', '2do Teniente', 'OFFICER'),
('b09044s02135s36047s44044t27114f40bb88ea9beaa9d10de4e9af2eaea79', 'Mayor', 'OFFICER'),
('b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642', 'Gral. de Brigada', 'OWNER'),
('b07244s01134s36047s44244t52114ef2302532c051c38ee561e6bf57d9d42', 'Tesorero Ejecutivo', 'OWNER')
ON DUPLICATE KEY UPDATE rank_name=VALUES(rank_name), role_name=VALUES(role_name);
