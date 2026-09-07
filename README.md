# College Codes

Coursework and lab material for second-year programming subjects at D. J. Sanghvi College of Engineering. The repository contains Python notebooks, introductory data-structure programs in C, and MySQL exercises.

The files are learning material rather than a packaged application. Some notebooks preserve example outputs and errors from classwork, and the C programs use older console functions such as `conio.h`, `clrscr()`, and `getch()`.

## Contents

### Python notebooks

The `PYTHON/` directory contains 16 notebooks. The `.ipynb_checkpoints/` directory is generated notebook-editor metadata and is not part of the learning set.

#### Lecture notebooks

| File                                                                                              | Focus                                                                                 |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Lecture 01](PYTHON/Python_Lecture_01_CW_16_July_2026.ipynb)                                      | Variables, built-in types, arithmetic, comparison, identity, and membership operators |
| [Lecture 02](PYTHON/Python_Lecture_02_CW_21_July_2026.ipynb)                                      | Input/output, type conversion, lists, tuples, and dictionaries                        |
| [Lecture 03](PYTHON/Python_Lecture_03_CW_23_July_2026.ipynb)                                      | Conditions, nested decisions, loops, `break`, and `continue`                          |
| [Lecture 04](PYTHON/Python_Lecture_04_CW_28_July_2026.ipynb)                                      | String indexing, slicing, methods, and whitespace handling                            |
| [Lecture 05](PYTHON/Python_Lecture_05_CW_30_July_2026.ipynb)                                      | `range()`, loops, nested loops, sums, patterns, and Fibonacci series                  |
| [Lecture 07](PYTHON/Python_Lecture_07_CW_06_August_2026.ipynb)                                    | Lists, nested lists, tuples, sets, frozensets, dictionaries, and unpacking            |
| [Lecture 08](PYTHON/Python_Lecture_08_CW_11_August_2026.ipynb)                                    | Further list and tuple operations, iteration, comparison, and unpacking               |
| [Lecture 08 notes absent](PYTHON/Python_Lecture_08_CW_11_August_2026%28notes_absent%29.ipynb)     | Separate classwork copy covering lists, tuples, sets, and dictionaries                |
| [Lectures 09 and 10](PYTHON/Python_Lecture_09_and10_CW_18_and_20_August_2026.ipynb)               | NumPy arrays, dimensions, shapes, data types, creation, and random values             |
| [Lecture 11 (current copy)](PYTHON/Python_Lecture_11_CW_3_September_2026.ipynb)                   | Pandas `Series` and `DataFrame` basics, indexing, labels, and table creation          |
| [Lecture 11 (absent copy)](PYTHON/Python_Lecture_11_CW_18_and_3_September_2026%28absent%29.ipynb) | Earlier classwork copy containing the same Pandas examples and dataset exercises      |

#### Experiment notebooks

| File                                                   | Exercises covered                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [Experiment 1](PYTHON/S004_Aaryan_Raorane_Exp1.ipynb)  | Input, arithmetic, averages, geometry, simple interest, temperature, distance, and swapping |
| [Experiment 2](PYTHON/S004_Aaryan_Raorane_Exp2.ipynb)  | Conditions, triangle classification, piecewise functions, unit conversion, and strings      |
| [Experiment 3](PYTHON/S004_Aaryan_Raorane_Expt3.ipynb) | Sums, even/odd counting, prime checking, Fibonacci, patterns, FizzBuzz, and strings         |
| [Experiment 4](PYTHON/S004_Aaryan_Raorane_Expt4.ipynb) | List methods, filtering, sorting, reversing, sets, duplicate counting, and dictionaries     |
| [Experiment 5](PYTHON/S004_Aaryan_Raorane_Expt5.ipynb) | Additional Python practice covering more problem-solving and revision exercises             |

Notebook outputs are retained in the files, but they should be treated as examples. Run cells again when checking or modifying a solution.

### Data structures in C

The `DATA STRUCTURE/` directory contains four menu-driven programs:

| File                                      | Structure                    | Operations                                                  |
| ----------------------------------------- | ---------------------------- | ----------------------------------------------------------- |
| [A1_DS_ST.C](DATA%20STRUCTURE/A1_DS_ST.C) | Fixed-size stack, capacity 4 | Push, pop, overflow, underflow                              |
| [LQUEUE.C](DATA%20STRUCTURE/LQUEUE.C)     | Linear queue, capacity 5     | Enqueue, dequeue, front, rear, display, overflow, underflow |
| [CQUEUE.C](DATA%20STRUCTURE/CQUEUE.C)     | Circular queue, capacity 6   | Enqueue, dequeue, front, rear, display, overflow, underflow |
| [LINKEDLI.C](DATA%20STRUCTURE/LINKEDLI.C) | Singly linked list           | Insert/delete at beginning, end, and position; display      |

`LINKEDLI.C` includes menu entries for search and search-and-delete, but those cases currently contain no implementation.

These are classroom implementations using global state and interactive input. They are useful for studying FIFO behavior, stack state, pointers, dynamic allocation, and linked-list traversal, but they are not portable production C programs as written.

### DBMS exercises

The `DBMS/` directory contains two SQL scripts and their supporting Word documents:

| File                                                  | Role                   | Main content                                                                                        |
| ----------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| [Lab 1 SQL](DBMS/DBMS_LAB_1_12_AUGUST_2026.sql)       | Schema                 | Creates the database and ten tables; demonstrates primary keys, `NOT NULL`, `CHECK`, and `DESCRIBE` |
| [Lab 1 document](DBMS/DBMS_LAB_1_12_AUGUST_2026.docx) | Supporting document    | Lab 1 write-up or reference material                                                                |
| [Lab 2 SQL](DBMS/DBMS_LAB_2_19_AUGUST_2026.sql)       | Relationships and data | Adds foreign keys, demonstrates `ALTER TABLE`, changes a column type, and inserts sample rows       |
| [Lab 2 document](DBMS/DBMS_LAB_2_19_AUGUST_2026.docx) | Supporting document    | Lab 2 write-up or reference material                                                                |

Lab 1 creates these tables: `student`, `mentor`, `subject`, `resources`, `study_pattern`, `test`, `grades`, `skills`, `hardskills`, and `softskills`. Run the scripts in order because Lab 2 depends on Lab 1's schema.

The scripts are intended to be run in order in MySQL. The second script depends on the schema created by the first and uses sample data such as mentor, student, subject, test, grade, and skill records.

## Repository layout

The top level is organized by subject. The tree below lists every tracked learning file; the generated `.ipynb_checkpoints/` folder is intentionally omitted.

```text
College-codes/
├── DATA STRUCTURE/
│   ├── A1_DS_ST.C                 # Stack
│   ├── CQUEUE.C                   # Circular queue
│   ├── LINKEDLI.C                 # Singly linked list
│   └── LQUEUE.C                   # Linear queue
├── DBMS/
│   ├── DBMS_LAB_1_12_AUGUST_2026.docx
│   ├── DBMS_LAB_1_12_AUGUST_2026.sql
│   ├── DBMS_LAB_2_19_AUGUST_2026.docx
│   └── DBMS_LAB_2_19_AUGUST_2026.sql
├── PYTHON/
│   ├── Python_Lecture_01_CW_16_July_2026.ipynb
│   ├── Python_Lecture_02_CW_21_July_2026.ipynb
│   ├── Python_Lecture_03_CW_23_July_2026.ipynb
│   ├── Python_Lecture_04_CW_28_July_2026.ipynb
│   ├── Python_Lecture_05_CW_30_July_2026.ipynb
│   ├── Python_Lecture_07_CW_06_August_2026.ipynb
│   ├── Python_Lecture_08_CW_11_August_2026.ipynb
│   ├── Python_Lecture_08_CW_11_August_2026(notes_absent).ipynb
│   ├── Python_Lecture_09_and10_CW_18_and_20_August_2026.ipynb
│   ├── Python_Lecture_11_CW_18_and_3_September_2026(absent).ipynb
│   ├── Python_Lecture_11_CW_3_September_2026.ipynb
│   ├── S004_Aaryan_Raorane_Exp1.ipynb
│   ├── S004_Aaryan_Raorane_Exp2.ipynb
│   ├── S004_Aaryan_Raorane_Expt3.ipynb
│   ├── S004_Aaryan_Raorane_Expt4.ipynb
│   └── S004_Aaryan_Raorane_Expt5.ipynb
└── README.md
```

## Getting started

### Python

Install Python 3 and Jupyter, then open the notebooks:

```bash
python -m pip install jupyter numpy
jupyter notebook
```

Open a notebook from `PYTHON/` and run its cells from top to bottom. NumPy is required for `Python_Lecture_09_and10_CW_18_and_20_August_2026.ipynb`; the other notebooks use the Python standard library.

### C

The programs include `conio.h` and calls commonly associated with Turbo C. A modern GCC installation may reject them. Use a compatible classroom environment, or replace the console-specific calls before compiling with a modern compiler.

For a compiler that provides those headers, the general command is:

```bash
gcc "DATA STRUCTURE/CQUEUE.C" -o cqueue
```

The `.C` extension may cause a compiler to treat the file as C++; use an explicit C language option where appropriate, for example `gcc -x c ...`, and test each program independently.

### MySQL

Connect to MySQL and run the scripts in this order:

```sql
SOURCE DBMS/DBMS_LAB_1_12_AUGUST_2026.sql;
SOURCE DBMS/DBMS_LAB_2_19_AUGUST_2026.sql;
```

Review the statements before running them on a shared server: the scripts create a database, alter tables, and insert sample data.

## Suggested study order

1. Work through the Python lecture notebooks from 01 to 05.
2. Continue with the collection notebooks 07 and 08, then the NumPy notebook.
3. Use the experiment notebooks to practise the fundamentals as small programs.
4. Read `A1_DS_ST.C`, then compare linear and circular queues before studying `LINKEDLI.C`.
5. Run the DBMS lab scripts in order and inspect the table relationships and sample rows.

## Notes

- This is an educational coursework repository maintained by Aaryan Raorane (S004).
- Filenames and dates reflect the classwork and lab submission organization.
- The repository has not been presented as a single tested build; validate individual notebooks, C programs, and SQL statements in the environment where you plan to use them.

## Links

- [Python notebooks](PYTHON/)
- [Data structure programs](DATA%20STRUCTURE/)
- [DBMS scripts and lab documents](DBMS/)
