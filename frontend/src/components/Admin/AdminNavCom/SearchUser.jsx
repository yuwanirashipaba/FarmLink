import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 ">
      <h1 className="text-teal-500 m-4 text-xl font-bold">All Users</h1>
      <input className="rounded-md outline-none bg-slate-100 p-3 w-80"
        type="text"
        placeholder="Search by first name"
        onChange={handleSearch}
      />
      <table className="m-5 rounded-md">
        <thead >
          <tr className="m-7 bg-teal-500">
            <th className="p-3 text-white">ID</th>
            <th className="p-3 text-white">First Name</th>
            <th className="p-3 text-white">Last Name</th>
            <th className="p-3 text-white">Email</th>
            <th className="p-3 text-white">Role</th>
            
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="p-2 pr-6">{user._id}</td>
              <td className="p-2 pr-6">{user.firstName}</td>
              <td className="p-2 pr-6">{user.lastName}</td>
              <td className="p-2 pr-6">{user.email}</td>
              <td className="p-2 pr-6">{user.role}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
