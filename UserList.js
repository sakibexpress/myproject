import React from "react";

function UserList() {
  const users = ["Alice", "Bob", "Charlie"];
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>{user}</li>
      ))}
    </ul>
  );
}

export default UserList;
