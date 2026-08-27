create database expt4_s004;
use expt4_s004;
create table employee
(
	eno int primary key,
    ename varchar(20), 
    jobtitle varchar(20), 
    jointdate int,
    eadd varchar(20),
    esal int ,
    dno int 
);
describe employee;
create table department
(
	dno int primary key,
    dname varchar(20)
);
describe department;
alter table employee
add foreign key(dno) references department(dno);

INSERT INTO department (dno, dname) VALUES 
(10, 'AIDS');

INSERT INTO department (dno, dname) VALUES 
(20, 'Computer Science');

INSERT INTO department (dno, dname) VALUES 
(30, 'IT');

INSERT INTO department (dno, dname) VALUES 
(40, 'Electronics');

INSERT INTO department (dno, dname) VALUES 
(50, 'Mechanical');

select * from department;

INSERT INTO employee (eno, ename, jobtitle, jointdate, eadd, esal, dno) VALUES 
(101, 'Manoj', 'Manager', 2024, 'Mumbai', 75000, 10);

INSERT INTO employee (eno, ename, jobtitle, jointdate, eadd, esal, dno) VALUES 
(102, 'Meera', 'Developer', 2021, 'Pune', 65000, 20);

INSERT INTO employee (eno, ename, jobtitle, jointdate, eadd, esal, dno) VALUES
(103, 'Aakash', 'Analyst', 2023, 'Delhi', 55000, 20);

INSERT INTO employee (eno, ename, jobtitle, jointdate, eadd, esal, dno) VALUES
(104, 'Neha', 'Intern', 2026, 'Mumbai', NULL, 30);

INSERT INTO employee (eno, ename, jobtitle, jointdate, eadd, esal, dno) VALUES
(105, 'Rahul', 'Manager', 2020, 'Bangalore', 90000, 40);

select * from employee;

select  ename from employee e, department d
where e.dno=d.dno AND d.dname='AIDS';

select ename from employee
where jobtitle = 'Manager';

select distinct(eadd) from employee;

select ename,jointdate from employee
where ename like 'm%';

select ename from employee
where esal>60000;

select ename from employee
where jointdate between 2023 and 2025;

select ename,jointdate from employee
where ename like '_e%';

select ename from employee
where jobtitle != 'Manager';

select * from employee
order by jointdate desc;

select ename from employee
where esal is NULL;

select avg(esal) from employee
where dno=20;

select dno,count(ename) from employee
group by dno;

select dno,avg(esal) from employee
group by dno;

select max(esal),min(esal) from employee;

update employee
set esal=1.1*esal 
where jointdate<2022;

select * from employee;