import { useEffect, useState } from "react";
import api from "../../Api/axios"; // your axios instance
import classes from "./Groups.module.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load groups.");
      }
    };

    fetchGroups();
  }, []);

  const toggleJoin = async (groupid) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post(
        `/groups/${groupid}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups((prev) =>
        prev.map((g) =>
          g.groupid === groupid
            ? {
                ...g,
                joined: data.status === "joined",
                memberCount: data.memberCount,
              }
            : g
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to join/leave the group.");
    }
  };

  return (
    <section className={classes.communityGroupsPage}>
      <h1>All Community Groups</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div className={classes.groupList}>
        {groups.length > 0 ? (
          groups.map((g) => (
            <div key={g.groupid} className={classes.groupCard}>
              <h3>{g.name}</h3>
              <p>{g.description}</p>
              <p>Members: {g.memberCount}</p>
              <button onClick={() => toggleJoin(g.groupid)}>
                {g.joined ? "Leave" : "Join"}
              </button>
            </div>
          ))
        ) : (
          <p>No groups found.</p>
        )}
      </div>
    </section>
  );
};

export default Groups;
