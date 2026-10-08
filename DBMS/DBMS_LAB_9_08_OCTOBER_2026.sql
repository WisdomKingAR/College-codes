CREATE DATABASE s004_exp09;
USE s004_exp09;
CREATE TABLE Employee (
    e_id INT PRIMARY KEY,
    e_name VARCHAR(50),
    e_sal VARCHAR(50),
    d_name VARCHAR(50)
);
DESCRIBE Employee;

INSERT INTO Employee VALUES(1, 'Rahul', 45000, 'HR');
INSERT INTO Employee VALUES(2, 'Priya', 50000, 'Finance');
INSERT INTO Employee VALUES(3, 'Amit', 55000, 'IT');
INSERT INTO Employee VALUES(4, 'Sneha', 48000, 'Marketing');
INSERT INTO Employee VALUES(5, 'Vikram', 60000, 'IT');
SELECT * FROM Employee;

CREATE INDEX idx_dname
ON Employee(d_name);

CREATE INDEX idx_salary
ON Employee(e_sal);

CREATE INDEX idx_dept_salary
ON Employee(d_name, e_sal);

SHOW INDEX FROM Employee;

EXPLAIN SELECT *
FROM Employee
WHERE d_name = 'IT';

EXPLAIN SELECT *
FROM Employee
WHERE e_name = 'Rahul';

EXPLAIN SELECT *
FROM Employee
WHERE e_sal = '50000';

EXPLAIN SELECT *
FROM Employee
WHERE d_name = 'IT'
AND e_sal = '69000';