CREATE DATABASE expt7_s004;
USE expt7_s004;
CREATE TABLE Student 
(
srollno INT,
sname VARCHAR(30),
sadd VARCHAR(40),
sage INT
);
DELIMITER //
CREATE PROCEDURE procinsert (IN srno INT,IN sname VARCHAR(30),IN sadd VARCHAR(40),IN sage INT)
begin
insert into Student values(srno,sname,sadd,sage);
end;
//
drop procedure procinsert;
call procinsert (1,'abc','mumbai',20);
call procinsert (2,'xyz','pune',25);
select * from Student;
DELIMITER //
CREATE PROCEDURE procdelete (IN srno int)
BEGIN
delete from Student where srollno = srno;
END;
//
call procdelete (2);
select * from Student;
DELIMITER //
CREATE PROCEDURE procupdate (IN p_srno INT, IN p_sadd VARCHAR(40))
BEGIN
    SELECT * FROM Student 
    WHERE srollno = p_srno;
    UPDATE Student SET sadd = p_sadd 
    WHERE srollno = p_srno;
END;
//
call procupdate(1,'Chennai');
select * from Student;

DELIMITER //
CREATE PROCEDURE procretrieve (IN srno INT)
BEGIN
    SELECT * FROM Student
    WHERE srollno=srno;
END;
//
call procretrieve(1);

delimiter //
create function factorial(num int)
returns int
deterministic
begin
declare i int default 1;
declare fact int default 1;
while(i<=num)
do set fact = fact *i;
set i=i+1;
end while;
return fact;
end;
//
select factorial(5)

DELIMITER //
CREATE FUNCTION multiply_numbers(num1 INT, num2 INT)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN num1 * num2;
END;
//
SELECT multiply_numbers(6, 7);