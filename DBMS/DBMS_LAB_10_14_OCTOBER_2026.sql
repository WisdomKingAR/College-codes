use aaryan_raorane_s004;
INSERT INTO student (s_id, s_name, s_gender, s_age, m_id) VALUES (3, 'Aaryan Raorane', 'M', 20, 1);
select * from student;

INSERT INTO mentor (m_id, m_first_name, m_middle_name, m_last_name, m_contact, m_exp) 
VALUES (1, 'John', 'A.', 'Doe', 1234567890, 5);

INSERT INTO subject (sub_code, sub_name, sub_credit, s_id) 
VALUES ('CS101', 'Database System', 4.0, 3);

INSERT INTO test (t_id, t_type, t_marks, sub_code, s_id, m_id) 
VALUES (4, 'Midterm', 85, 'CS101', 3, 1);

select * from grades;