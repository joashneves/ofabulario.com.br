import database from "infra/database";

async function create(usersInputValues) {

  const result = await database.query({
    text:`INSERT INTO 
     users (username, email, password) 
    VALUES
     ($1, $2, $3)
    RETURNING 
    *;
     `,
     values: [usersInputValues.username,
       usersInputValues.email,
        usersInputValues.password]});
  console.log("result.rows[0]",result.rows[0]);
  return result.rows[0];
}

const user = {
  create,
};

export default user;