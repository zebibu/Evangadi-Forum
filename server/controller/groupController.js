const db = require("../db/dbConfig"); // must be mysql2/promise

// Fetch all groups with member count & join status
const getAllGroups = async (req, res) => {
  const userid = req.user?.userid; // optional chaining to prevent crash
  if (!userid) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [groups] = await db.query(
      `
      SELECT g.*, 
             COUNT(ug.userid) AS memberCount,
             MAX(CASE WHEN ug.userid = ? THEN 1 ELSE 0 END) AS joined
      FROM \`groups\` g
      LEFT JOIN user_groups ug ON g.groupid = ug.groupid
      GROUP BY g.groupid
      `,
      [userid]
    );

    // Convert joined flag to boolean
    const groupsWithJoined = groups.map((g) => ({
      ...g,
      joined: g.joined === 1,
    }));

    res.json(groupsWithJoined);
  } catch (err) {
    console.error("Error fetching groups:", err.message);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Toggle join/leave group
const toggleGroupMembership = async (req, res) => {
  const { groupid } = req.params;
  const userid = req.user?.userid;

  if (!userid) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Check if already joined
    const [existing] = await db.query(
      "SELECT * FROM user_groups WHERE userid = ? AND groupid = ?",
      [userid, groupid]
    );

    let status;
    if (existing.length > 0) {
      // Leave group
      await db.query(
        "DELETE FROM user_groups WHERE userid = ? AND groupid = ?",
        [userid, groupid]
      );
      status = "left";
    } else {
      // Join group
      await db.query(
        "INSERT INTO user_groups (userid, groupid) VALUES (?, ?)",
        [userid, groupid]
      );
      status = "joined";
    }

    // Updated member count
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS memberCount FROM user_groups WHERE groupid = ?",
      [groupid]
    );
    const memberCount = countResult[0].memberCount;

    res.json({ status, memberCount });
  } catch (err) {
    console.error("Error toggling group join:", err.message);
    res.status(500).json({ error: "Failed to toggle group join" });
  }
};

module.exports = {
  getAllGroups,
  toggleGroupMembership,
};
