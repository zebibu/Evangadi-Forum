-- Users table
CREATE TABLE IF NOT EXISTS users (
    userid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,   
    email VARCHAR(100) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,  
    PRIMARY KEY (userid)
);


--Community Group table
CREATE TABLE IF NOT EXISTS groups (
  groupid INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) UNIQUE,
  description TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  created_by INT UNSIGNED DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (groupid),
  FOREIGN KEY (created_by) REFERENCES users(userid) ON DELETE SET NULL
);

--Group Columns - insert default groups (prevent duplicates)
INSERT INTO groups (name, slug, description, is_demo)
SELECT * FROM (SELECT 'Web Development', 'web-dev', 'All about front-end, back-end, and full stack topics.', TRUE) AS tmp
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE slug = 'web-dev'
) LIMIT 1;

INSERT INTO groups (name, slug, description, is_demo)
SELECT * FROM (SELECT 'Machine Learning', 'ml', 'Discussions about AI and machine learning models.', TRUE) AS tmp
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE slug = 'ml'
) LIMIT 1;

INSERT INTO groups (name, slug, description, is_demo)
SELECT * FROM (SELECT 'Algebra', 'algebra', 'Learn Algebra fundamentals and beyond.', TRUE) AS tmp
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE slug = 'algebra'
) LIMIT 1;

INSERT INTO groups (name, slug, description, is_demo)
SELECT * FROM (SELECT 'Software Testing', 'software-testing', 'All about testing methodologies and QA practices.', TRUE) AS tmp
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE slug = 'software-testing'
) LIMIT 1;

INSERT INTO


--Connects User to Community Group table
CREATE TABLE IF NOT EXISTS user_groups (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    userid INT UNSIGNED NOT NULL,
    groupid INT UNSIGNED NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (groupid) REFERENCES groups(groupid) ON DELETE CASCADE,
    UNIQUE (userid, groupid) -- prevents joining the same group twice
);

--

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    questionid VARCHAR(100) NOT NULL UNIQUE,
    userid INT UNSIGNED NOT NULL,
   group INT UNSIGNED NULL, --to link question to a group
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    tag VARCHAR(50),
    PRIMARY KEY (id),
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
    answerid INT UNSIGNED NOT NULL AUTO_INCREMENT,
    questionid VARCHAR(100) NOT NULL,
    userid INT UNSIGNED NOT NULL,
    answer TEXT NOT NULL,
    PRIMARY KEY (answerid),
    FOREIGN KEY (questionid) REFERENCES questions(questionid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);


