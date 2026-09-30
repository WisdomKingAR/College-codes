create database S004_expt6A;
use S004_expt6A;
create table Customer(
cno int primary key,
cname varchar(30),
cadd varchar(30),
cage int
);
describe Customer;
create table Loan(
lno int primary key,
lamt int,
ldate date,
cno int 
);
describe Loan;
alter table Loan
add foreign key(cno) references Customer(cno);

insert into customer (cno, cname, cadd, cage) values 
(1, 'michael', 'new york', 30),
(2, 'alice', 'boston', 25),
(3, 'mary', 'chicago', 35),
(4, 'john', 'los angeles', 40),
(5, 'david', 'houston', 45);

select * from customer;

insert into loan (lno, lamt, ldate, cno) values 
(101, 60000, '2026-01-15', 1),
(102, 40000, '2026-02-10', 2),
(103, 85000, '2026-03-05', 3),
(104, 75000, '2026-04-20', 4),
(105, 120000, '2026-05-12', 5);

select * from loan;

create view customer_detail as
select l.cno, cname, lamt
from customer c, loan l
where c.cno = l.cno 
and lamt between 50000 and 100000;

select * from customer_detail;

select cname from customer_detail where lamt<70000;

select cname from customer_detail where cname like 'm%';


create database s004_expt6b;
use s004_expt6b;
create table employee(
eid int primary key,
ename varchar(30),
dname varchar(30),
sal int
);
describe employee;
create table employee_log(
logid int auto_increment primary key,
empid int,
action varchar(20),
action_date datetime
);
describe employee_log;
insert into employee (eid,ename,dname,sal) values (1,'Alice','Finance',70000);
select * from employee;

delimiter // 
create trigger before_insert_trigger
before insert on employee
for each row
begin
set new.dname = upper(new.dname);
end;
//

insert into employee (eid,ename,dname,sal) values (2,'Bob','hr',75000);
select * from employee;

delimiter // 
create trigger after_insert_trigger
before insert on employee
for each row
begin
insert into employee_log(empid,action,action_date) values(new.eid,'insert',now());
end;
//

insert into employee (eid,ename,dname,sal) values (3,'Charlie','Finance',75000);
select * from employee_log;

delimiter // 
create trigger before_update_trigger
before update on employee
for each row
begin
if new.sal<old.sal then 
set new.sal = old.sal;
end if;
end;
//

update employee set sal=40000 where eid=1;
select * from employee;


delimiter // 
create trigger after_delete_trigger
after delete on employee
for each row
begin
insert into employee_log(empid,action,action_date) values(old.eid,'delete',now());
end;
//

delete from employee where eid=3;
select * from employee_log;