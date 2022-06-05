import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection("localhost");
  const id = uuidv4();
  const encryptedPassword = await hash("admin", 8);

  await connection.query(`
  INSERT INTO users (id, name, email, password, "isAdmin", driver_license, created_at)
  VALUES (
    '${id}',
    'admin',
    'admin@rentalx.com.br',
    '${encryptedPassword}',
    true,
    '0123456789',
    NOW()
  )
`);
}

create().then(() => console.log("Admin user created!"));
