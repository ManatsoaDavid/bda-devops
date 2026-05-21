-- ============================================
-- CRÉATION DE L'UTILISATEUR ET BASE
-- ============================================
-- (déjà géré par les variables d'environnement
--  POSTGRES_USER et POSTGRES_DB dans Docker Compose)

-- ============================================
-- CRÉATION DES TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS client (
    ncompte     SERIAL PRIMARY KEY,
    nomclient   VARCHAR(100) NOT NULL,
    solde       DECIMAL(15,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS versement (
    nversement  SERIAL PRIMARY KEY,
    ncheque     VARCHAR(50),
    ncompte     INTEGER NOT NULL REFERENCES client(ncompte),
    montant     DECIMAL(15,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_versement (
    id              SERIAL PRIMARY KEY,
    type_action     VARCHAR(20) NOT NULL,
    date_operation  TIMESTAMP DEFAULT NOW(),
    nversement      INTEGER,
    ncompte         INTEGER,
    nomclient       VARCHAR(100),
    montant_ancien  DECIMAL(15,2),
    montant_nouv    DECIMAL(15,2),
    utilisateur     VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS utilisateurs (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) DEFAULT 'user',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TRIGGER INSERT
-- ============================================
CREATE OR REPLACE FUNCTION fn_audit_insert_versement()
RETURNS TRIGGER AS $$
DECLARE
    v_nomclient    VARCHAR(100);
    v_solde_ancien DECIMAL(15,2);
    v_solde_nouv   DECIMAL(15,2);
    v_appuser      VARCHAR(100);
BEGIN
    BEGIN
        v_appuser := current_setting('app.username');
    EXCEPTION WHEN OTHERS THEN
        v_appuser := current_user;
    END;

    SELECT nomclient, solde INTO v_nomclient, v_solde_ancien
    FROM client WHERE ncompte = NEW.ncompte;

    v_solde_nouv := v_solde_ancien + NEW.montant;

    UPDATE client SET solde = v_solde_nouv
    WHERE ncompte = NEW.ncompte;

    INSERT INTO audit_versement (
        type_action, nversement, ncompte,
        nomclient, montant_ancien, montant_nouv, utilisateur
    ) VALUES (
        'INSERT', NEW.nversement, NEW.ncompte,
        v_nomclient, v_solde_ancien, v_solde_nouv, v_appuser
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_insert_versement
    AFTER INSERT ON versement
    FOR EACH ROW EXECUTE PROCEDURE fn_audit_insert_versement();

-- ============================================
-- TRIGGER UPDATE
-- ============================================
CREATE OR REPLACE FUNCTION fn_audit_update_versement()
RETURNS TRIGGER AS $$
DECLARE
    v_nomclient    VARCHAR(100);
    v_solde_ancien DECIMAL(15,2);
    v_solde_nouv   DECIMAL(15,2);
    v_diff         DECIMAL(15,2);
    v_appuser      VARCHAR(100);
BEGIN
    BEGIN
        v_appuser := current_setting('app.username');
    EXCEPTION WHEN OTHERS THEN
        v_appuser := current_user;
    END;

    SELECT nomclient, solde INTO v_nomclient, v_solde_ancien
    FROM client WHERE ncompte = NEW.ncompte;

    v_diff       := NEW.montant - OLD.montant;
    v_solde_nouv := v_solde_ancien + v_diff;

    UPDATE client SET solde = v_solde_nouv
    WHERE ncompte = NEW.ncompte;

    INSERT INTO audit_versement (
        type_action, nversement, ncompte,
        nomclient, montant_ancien, montant_nouv, utilisateur
    ) VALUES (
        'UPDATE', NEW.nversement, NEW.ncompte,
        v_nomclient, v_solde_ancien, v_solde_nouv, v_appuser
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_versement
    AFTER UPDATE ON versement
    FOR EACH ROW EXECUTE PROCEDURE fn_audit_update_versement();

-- ============================================
-- TRIGGER DELETE
-- ============================================
CREATE OR REPLACE FUNCTION fn_audit_delete_versement()
RETURNS TRIGGER AS $$
DECLARE
    v_nomclient    VARCHAR(100);
    v_solde_ancien DECIMAL(15,2);
    v_solde_nouv   DECIMAL(15,2);
    v_appuser      VARCHAR(100);
BEGIN
    BEGIN
        v_appuser := current_setting('app.username');
    EXCEPTION WHEN OTHERS THEN
        v_appuser := current_user;
    END;

    SELECT nomclient, solde INTO v_nomclient, v_solde_ancien
    FROM client WHERE ncompte = OLD.ncompte;

    v_solde_nouv := v_solde_ancien - OLD.montant;

    UPDATE client SET solde = v_solde_nouv
    WHERE ncompte = OLD.ncompte;

    INSERT INTO audit_versement (
        type_action, nversement, ncompte,
        nomclient, montant_ancien, montant_nouv, utilisateur
    ) VALUES (
        'DELETE', OLD.nversement, OLD.ncompte,
        v_nomclient, v_solde_ancien, v_solde_nouv, v_appuser
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_versement
    AFTER DELETE ON versement
    FOR EACH ROW EXECUTE PROCEDURE fn_audit_delete_versement();

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Clients de test
INSERT INTO client (nomclient, solde) VALUES
    ('Jean Dupont',  1000.00),
    ('Marie Martin', 2500.00),
    ('Paul Bernard',  500.00);

-- Utilisateurs (mot de passe : password)
INSERT INTO utilisateurs (username, password, role) VALUES
    ('Manatsoa', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
    ('David',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Droits sur toutes les tables et séquences
GRANT ALL ON ALL TABLES    IN SCHEMA public TO manatsoa_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO manatsoa_user;
