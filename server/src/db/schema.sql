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
  total_minutes INT DEFAULT 0,
  password_hash VARCHAR(255) DEFAULT NULL,
  approved TINYINT(1) DEFAULT 0
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

CREATE TABLE IF NOT EXISTS floods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('defense', 'welcome') NOT NULL,
  content TEXT NOT NULL
);

-- Seed Data para Configuración de Rangos por Placas de Habbo.es
INSERT INTO group_ranks (badge_code, rank_name, role_name) VALUES
('b09134s02155s36047s44134t27114e862510ff77289cfa52c2552470f2105', 'Grumete', 'MEMBER'),
('b09054s02135s36047s44054t27114cd31c00da2fd4753e88e344a7723ff14', 'Cabo', 'MEMBER'),
('b09024s02135s36047s44024t271148598db7ba6558ee51c564e76ef038622', '2do Teniente', 'OFFICER'),
('b09104s02135s36047s44104t2711491934527c2d1d1e021e0a14fce6a11f7', 'Mayor', 'OFFICER'),
('b09044s02135s36047s44044t27114f40bb88ea9beaa9d10de4e9af2eaea79', 'Gral. de Brigada', 'OWNER'),
('b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642', 'Tesorero Ejecutivo', 'OWNER')
ON DUPLICATE KEY UPDATE rank_name=VALUES(rank_name), role_name=VALUES(role_name);

-- Seed Data para Floods
INSERT INTO floods (id, category, content) VALUES
(1, 'defense', '★ TÚ NOS VIENES A ATACAR, PUES ELEGISTE LA PEOR OPCIÓN. ★ ⚡ B.M.T ⚡ TE DOMINA. ⚡ B.M.T ⚡ RÍNDETE ANTE NOSOTROS. ★'),
(2, 'defense', '⊘ SØMØS ⚡ B.M.T ⚡ T3 GØB3RNAMOS. ⊘ SØMØS LA NUEVA ERA. ⚡ B.M.T ⚡ NØSØTROS NO OS TEMEMOS. ⊘'),
(3, 'welcome', '♣ ¡Bienvenidos a BMT™! [★] Paga diaria de $7 por 1 hora y 30 minutos, más ascenso a Recluta. ¡Ven y te doy empleo! ♥'),
(4, 'welcome', '★ MI VIDA ERA GRIS, PERO GRACIAS A [BMT] PUDE COMPRAR COLORES. [BMT] PAGA SEMANAL. ¡ÚNETE! ♧♧♧♧')
ON DUPLICATE KEY UPDATE category=VALUES(category), content=VALUES(content);

CREATE TABLE IF NOT EXISTS permissions (
  action_key VARCHAR(100) PRIMARY KEY,
  min_role VARCHAR(100) NOT NULL DEFAULT 'OWNER'
);

-- Seed Data para Permisos
INSERT INTO permissions (action_key, min_role) VALUES
('edit_floods', 'OWNER'),
('manage_registrations', 'OFFICER'),
('manage_members', 'OFFICER'),
('manage_duties', 'OFFICER'),
('manage_paybox', 'OWNER')
ON DUPLICATE KEY UPDATE min_role=VALUES(min_role);
