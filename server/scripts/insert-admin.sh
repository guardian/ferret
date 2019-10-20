PASSWORD='$2b$10$jS4u.ak/8Fx4jaP28YXnfexXcb8Yi18r.uPFTValJMYmAvd1TKfqe'
COMMAND="INSERT INTO users (id, username, display_name, password, settings) VALUES ('test', 'admin', 'Administrator', '$PASSWORD', '{}'::JSONB)"
PGPASSWORD=ferret psql -h localhost -p 9002 -d ferret -U ferret -c "$COMMAND"