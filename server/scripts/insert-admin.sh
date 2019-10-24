PASSWORD='$2b$10$jS4u.ak/8Fx4jaP28YXnfexXcb8Yi18r.uPFTValJMYmAvd1TKfqe'

PGPASSWORD=ferret psql -h localhost -p 9002 -d ferret -U ferret <<END
BEGIN;
INSERT INTO users (id, username, display_name, password, settings) VALUES ('ff96d045-d40b-42d8-92ae-071c3d3c1369', 'admin', 'Administrator', '$PASSWORD', '{}'::JSONB);
INSERT INTO user_permissions (user_id, permission) VALUES ('ff96d045-d40b-42d8-92ae-071c3d3c1369', 'manage_users');
INSERT INTO user_permissions (user_id, permission) VALUES ('ff96d045-d40b-42d8-92ae-071c3d3c1369', 'manage_projects');
INSERT INTO user_permissions (user_id, permission) VALUES ('ff96d045-d40b-42d8-92ae-071c3d3c1369', 'manage_monitors');
COMMIT;
END
