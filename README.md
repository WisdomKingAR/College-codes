# College Codes

Coursework and lab material for second-year programming subjects at D. J. Sanghvi College of Engineering. The repository holds Python notebooks and practical sheets, data-structure programs in C with their experiment write-ups, and MySQL lab scripts with write-ups. It also contains one unrelated side project, `saturnv-3d/`.

The files are learning material rather than a packaged application. Notebook outputs are preserved from classwork, the C programs use older console functions such as `conio.h`, `clrscr()`, and `getch()`, and the SQL scripts create databases and sample data when run.

## Contents

| Section | Directory | What is there |
| --- | --- | --- |
| [Python coursework](#python-coursework) | [`PYTHON/`](PYTHON/) | Lecture and experiment notebooks, practical sheets, write-ups, CSV datasets |
| [Data structures in C](#data-structures-in-c) | [`DATA STRUCTURE/`](DATA%20STRUCTURE/) | Ten menu-driven C programs plus seven experiment write-ups |
| [DBMS exercises](#dbms-exercises) | [`DBMS/`](DBMS/) | Seven SQL lab scripts, lab documents, and write-ups |
| [Saturn V 3D](#saturn-v-3d) | [`saturnv-3d/`](saturnv-3d/) | Standalone scroll-driven 3D web project (not coursework) |

## Repository layout

The top level is organized by subject. The tree below lists the tracked learning files; generated Jupyter checkpoints and local environment folders are omitted.

```text
College-codes/
├── DATA STRUCTURE/
│   ├── CODES/
│   │   ├── A1_DS_ST.C             # Array stack, capacity 4
│   │   ├── BINSEARC.C             # Binary search tree
│   │   ├── CQUEUE.C               # Circular queue, capacity 6
│   │   ├── DOUBLYLL.C             # Doubly linked list
│   │   ├── LINKEDLI.C             # Singly linked list
│   │   ├── LQUEUE.C               # Linear queue, capacity 5
│   │   ├── MERGESORT.C            # Merge-sort notes (draft, untracked)
│   │   ├── QUICKSOR.C             # Quick sort
│   │   ├── SLLSTACK.C             # Stack implemented on a linked list
│   │   └── SSLQUEUE.C             # Queue implemented on a linked list
│   └── EXPERIMENTS/
│       └── S004_AARYAN_RAORANE_EXPT1..7   # Write-ups (.docx and .pdf)
├── DBMS/
│   ├── DBMS_LAB_1_12_AUGUST_2026.sql      # Labs 1-6 and 8 (no Lab 7 script)
│   ├── DBMS_LAB_2_19_AUGUST_2026.sql
│   ├── DBMS_LAB_3_27_AUGUST_2026.sql
│   ├── DBMS_LAB_4_10_SEPTEMBER_2026.sql
│   ├── DBMS_LAB_5_23_SEPTEMBER_2026.sql
│   ├── DBMS_LAB_6_30_SEPTEMBER_2026.sql
│   ├── DBMS_LAB_8_07_OCTOBER_2026.sql
│   ├── DBMS_LAB_1/2 (.docx and .pdf), EXP_4..EXP_8 (.docx)   # Lab documents
│   └── S004_AARYAN_RAORANE_WRITEUP_DBMS_EXPT_*.pdf           # Write-ups
├── PYTHON/
│   ├── Python_Lecture_01..16 *.ipynb      # Classwork notebooks (see table)
│   ├── S004_Aaryan_Raorane_Exp*.ipynb     # Experiment notebooks 1-8 and 13
│   ├── Practical_1..Practical5 *.docx/pdf # Practical sheets with problem statements
│   ├── S004_AARYAN_RAORANE_WRITEUP_EXPT_*.pdf                # Write-ups
│   ├── *.csv, quad.png                    # Datasets used by the notebooks
│   └── Python_Lecture_16_module_exception_and_file_handling/  # Module example project
├── saturnv-3d/                            # Standalone scroll-driven 3D project
└── README.md
```

## Python coursework

`PYTHON/` holds three generations of material: lecture notebooks from the classwork sessions, experiment notebooks submitted against the practical sheets, and the practical sheets and write-ups themselves.

### Lecture notebooks

| File | Focus |
| --- | --- |
| [Lecture 01](PYTHON/Python_Lecture_01_CW_16_July_2026.ipynb) | Variables, arithmetic/comparison operators, identity and membership operators |
| [Lecture 02](PYTHON/Python_Lecture_02_CW_21_July_2026.ipynb) | Input/output, type conversion of input, `print` separators and endings |
| [Lecture 03](PYTHON/Python_Lecture_03_CW_23_July_2026.ipynb) | `if`/`elif`/`else`, nested and one-line conditionals, string indexing and slicing |
| [Lecture 04](PYTHON/Python_Lecture_04_CW_28_July_2026.ipynb) | String whitespace methods: `strip`, `lstrip`, `rstrip` |
| [Lecture 05](PYTHON/Python_Lecture_05_CW_30_July_2026.ipynb) | `range()`, `for` loops, tables, factorials, digit sums, palindromes, Fibonacci |
| [Lecture 07](PYTHON/Python_Lecture_07_CW_06_August_2026.ipynb) | Lists, tuples, sets, dictionaries and their common methods |
| [Lecture 08](PYTHON/Python_Lecture_08_CW_11_August_2026.ipynb) | Tuples, sets, set algebra, `frozenset`, converting between collections |
| [Lecture 08 (notes absent)](PYTHON/Python_Lecture_08_CW_11_August_2026%28notes_absent%29.ipynb) | Separate classwork copy: list mutability and list comprehension |
| [Lectures 09 and 10](PYTHON/Python_Lecture_09_and10_CW_18_and_20_August_2026.ipynb) | NumPy arrays: creation, dimensions, shapes, data types, random values |
| [Lectures 11, 12 and 13](PYTHON/Python_Lecture_11_12_and_13_CW_3_8_and_10_September_2026.ipynb) | Pandas `Series`/`DataFrame`, index rename and reset, `titanic.csv` exercises |
| [Lecture 11 (absent copy)](PYTHON/Python_Lecture_11_CW_18_and_3_September_2026%28absent%29.ipynb) | Earlier classwork copy of the same Pandas material |
| [Lecture 14 — data cleaning](PYTHON/Python_Lecture_14_CW_22_September_2026_Data_Cleaning.ipynb) | Missing-value handling (forward fill), z-scores with SciPy |
| [Lecture 14 — data visualization](PYTHON/Python_Lecture_14_CW_22_September_2026_Data_Visualization.ipynb) | Matplotlib and Seaborn charts: line, bar, pie, box, pair plot, heatmap |
| [Lecture 15](PYTHON/Python_Lecture_15_CW_23_September_2026.ipynb) | Functions: default parameters, `*args`, `**kwargs`, `functools.reduce` |
| [Lecture 16](PYTHON/Python_Lecture_16_module_exception_and_file_handling/Python_Lecture_16_CW_06_October_2026.ipynb) | Modules, `math`/`statistics`/`datetime`, exception and file handling |

There is no Lecture 06 notebook. Lecture 16 ships as a folder with two example modules, [`MyModule1.py`](PYTHON/Python_Lecture_16_module_exception_and_file_handling/MyModule1.py) and [`MyModule2.py`](PYTHON/Python_Lecture_16_module_exception_and_file_handling/MyModule2.py), plus notebook copies of each.

PDF exports exist for Lectures 01-05, 07, 08 and 09-10 alongside the notebooks.

### Experiment notebooks

These are the submissions against the practical sheets. Filenames are inconsistent (`Exp` vs `Expt`) because they follow the upload names used at the time.

| File | Exercises covered |
| --- | --- |
| [Experiment 1](PYTHON/S004_Aaryan_Raorane_Exp1.ipynb) | Input, arithmetic, comparison, square, triangle area, averages |
| [Experiment 2](PYTHON/S004_Aaryan_Raorane_Exp2.ipynb) | Triangle classification, piecewise function, BMI, unit conversion, strings |
| [Experiment 3](PYTHON/S004_Aaryan_Raorane_Expt3.ipynb) | Sums, even/odd counting, prime checking, Fibonacci, nested patterns |
| [Experiment 4](PYTHON/S004_Aaryan_Raorane_Expt4.ipynb) | List functions: insert, sort, delete, remove, reverse; set and dictionary work |
| [Experiment 5](PYTHON/S004_Aaryan_Raorane_Expt5.ipynb) | NumPy: array sums and averages, maximum element, trace of a matrix |
| [Experiment 6](PYTHON/S004_Aaryan_Raorane_Expt6.ipynb) | Pandas `Series` and `DataFrame` creation from dicts and Series |
| [Experiment 7](PYTHON/S004_Aaryan_Raorane_Expt7.ipynb) | Titanic data cleaning, median imputation, z-scores, plots |
| [Experiment 8](PYTHON/S004_Aaryan_Raorane_Expt8.ipynb) | Functions: leap year, filtering, defaults, `*args`, `**kwargs` |
| [Experiment 13](PYTHON/S004_Aaryan_Raorane_Expt13.ipynb) | Matplotlib/Seaborn charts over the Titanic, Iris, and wine datasets |

[`practice.ipynb`](PYTHON/practice.ipynb) is an unstructured scratch notebook.

Notebook outputs are retained in the files, but treat them as examples. Run cells again when checking or modifying a solution.

### Practical sheets

The `Practical_*.docx` and `.pdf` pairs are the assignment sheets with aims and problem statements. The experiment notebooks answer them.

| Sheet | Topic |
| --- | --- |
| [Practical 1](PYTHON/Practical_1-Python%20Programming.docx) | Data types, input/output, arithmetic/relational/logical/bitwise operators |
| [Practical 2](PYTHON/Practical2%20Python%20Programming.docx) | Conditional statements and strings |
| [Practical 3](PYTHON/Practical3%20Python%20Programming.docx) | Looping and string functions |
| [Practical 4](PYTHON/Practical4%20Python%20Programming.docx) | Sequences and dictionaries |
| [Practical 5](PYTHON/Practical5%20Python%20Programming.docx) | NumPy operations and matrix functions |

### Write-ups and PDF exports

- `S004_AARYAN_RAORANE_WRITEUP_EXPT_1.pdf` … `EXPT_5.pdf` — individual write-ups for experiments 1-5.
- `S004_Aaryan_Raorane_Exp_1_to5.pdf` — combined copy of the same five.
- `S004_Aaryan_Raorane_Exp1.pdf`, `Exp2.pdf`, `Expt3.pdf`, `Expt4.pdf`, `Expt5.pdf` — notebook exports for those experiments.

### Datasets

Used by the Pandas, cleaning, and visualization notebooks. Notebook cells open them by relative name, so run Jupyter from inside `PYTHON/`.

| File | Contents | Used by |
| --- | --- | --- |
| `titanic.csv`, `titanic (1).csv` | Titanic passenger records | Lectures 11-13, Experiments 7 and 13 |
| `Iris.csv` | Iris flower measurements | Experiments 7 and 13 |
| `winequality-red.csv`, `WineQT (1).csv` | Wine quality datasets | Experiments 7 and 13 |
| `gender_submission.csv` | Kaggle Titanic sample submission | Reference data |
| `Temp_output_1.csv`, `Temp_output_2.csv` | Files written by the Lecture 11 notebook | Lecture 11-13 output |
| `quad.png` | Image used in the visualization lecture | Lecture 14 (visualization) |

Two pairs (`titanic (1).csv` / `titanic.csv`, `WineQT (1).csv` / `winequality-red.csv`) are duplicate downloads; the notebooks reference them by different names.

## Data structures in C

`DATA STRUCTURE/` has two subfolders: `CODES/` with the programs and `EXPERIMENTS/` with the submitted write-ups.

### Programs

| File | Structure | Operations |
| --- | --- | --- |
| [A1_DS_ST.C](DATA%20STRUCTURE/CODES/A1_DS_ST.C) | Fixed-size array stack, capacity 4 | Push, pop, overflow, underflow |
| [LQUEUE.C](DATA%20STRUCTURE/CODES/LQUEUE.C) | Linear queue, capacity 5 | Enqueue, dequeue, front, rear, display, overflow, underflow |
| [CQUEUE.C](DATA%20STRUCTURE/CODES/CQUEUE.C) | Circular queue, capacity 6 | Enqueue, dequeue, front, rear, display, overflow, underflow |
| [LINKEDLI.C](DATA%20STRUCTURE/CODES/LINKEDLI.C) | Singly linked list | Insert/delete at beginning, end, and position; search; search-and-delete; display |
| [SLLSTACK.C](DATA%20STRUCTURE/CODES/SLLSTACK.C) | Stack on a linked list | Push, pop, traverse |
| [SSLQUEUE.C](DATA%20STRUCTURE/CODES/SSLQUEUE.C) | Queue on a linked list | Enqueue, dequeue, traverse |
| [DOUBLYLL.C](DATA%20STRUCTURE/CODES/DOUBLYLL.C) | Doubly linked list | Add/delete at begin and end, forward and reverse display |
| [BINSEARC.C](DATA%20STRUCTURE/CODES/BINSEARC.C) | Binary search tree | Insert, pre/in/post-order traversal, height, mirror, search |
| [QUICKSOR.C](DATA%20STRUCTURE/CODES/QUICKSOR.C) | Array sorting | Quick sort with Lomuto-style partition |
| [MERGESORT.C](DATA%20STRUCTURE/CODES/MERGESORT.C) | — | Notes and pseudocode only; the implementation is not written yet |

`MERGESORT.C` is currently a comment block explaining divide-and-conquer; it is also untracked in git.

These are classroom implementations using global state and interactive input. They are useful for studying FIFO behavior, stack state, pointers, dynamic allocation, tree traversal, and sorting, but they are not portable production C programs as written.

### Experiment write-ups

`EXPERIMENTS/` contains `S004_AARYAN_RAORANE_EXPT1` through `EXPT7`, each as a `.docx` and a `.pdf`.

| Write-up | Aim |
| --- | --- |
| EXPT 1 | Array stack simulating browser history: push, pop, peek, display |
| EXPT 2 | Infix-to-postfix conversion using a stack |
| EXPT 3 | Linear and circular queues for a hospital patient registration system |
| EXPT 4 | Insert/delete/navigation operations for a linked collection (post-lab questions) |
| EXPT 5 | Stack and queue implemented on linked lists |
| EXPT 6 | Doubly linked list simulating an image viewer |
| EXPT 7 | Binary search tree: create, delete, search, display (numbered Experiment 8 in the document) |

## DBMS exercises

`DBMS/` contains seven SQL lab scripts, the lab documents, and the individual write-ups. There is no Lab 7 script; experiment numbering and lab numbering do not line up, so the table below maps each script to its write-up.

| Script | Database and content | Write-up |
| --- | --- | --- |
| [Lab 1](DBMS/DBMS_LAB_1_12_AUGUST_2026.sql) | `AARYAN_RAORANE_S004`; ten tables (`student`, `mentor`, `subject`, `resources`, `study_pattern`, `test`, `grades`, `skills`, `hardskills`, `softskills`); primary keys, `NOT NULL`, `CHECK`, `DESCRIBE` | [docx](DBMS/DBMS_LAB_1_12_AUGUST_2026.docx) / [pdf](DBMS/DBMS_LAB_1_12_AUGUST_2026.pdf) |
| [Lab 2](DBMS/DBMS_LAB_2_19_AUGUST_2026.sql) | Adds foreign keys with `ALTER TABLE`, changes a column type, inserts sample rows | [docx](DBMS/DBMS_LAB_2_19_AUGUST_2026.docx) / [pdf](DBMS/DBMS_LAB_2_19_AUGUST_2026.pdf) |
| [Lab 3](DBMS/DBMS_LAB_3_27_AUGUST_2026.sql) | `expt4_s004`; `employee` and `department`; `SELECT` filtering, `LIKE`, `BETWEEN`, aggregates, `GROUP BY`, `UPDATE` | [EXP 4 docx](DBMS/EXP_4_DBMS_LAB_3_27_AUGUST_2026.docx) / [pdf](DBMS/EXP_4_DBMS_LAB_3_27_AUGUST_2026.pdf) |
| [Lab 4](DBMS/DBMS_LAB_4_10_SEPTEMBER_2026.sql) | `companyexpt4`; `Employee`, `Works`, `Company`, `Manages`; joins (equi, outer) and nested queries | [EXP 5 docx](DBMS/EXP_5_DBMS_LAB_4_11_SEPTEMBER_2026.docx) |
| [Lab 5](DBMS/DBMS_LAB_5_23_SEPTEMBER_2026.sql) | `expt7_s004`; stored procedures (`procinsert`, `procdelete`, `procupdate`, `procretrieve`) and functions (`factorial`, `multiply_numbers`) | [EXP 7 docx](DBMS/EXP_7_DBMS_LAB_5_23_SEPTEMBER_2026.docx) |
| [Lab 6](DBMS/DBMS_LAB_6_30_SEPTEMBER_2026.sql) | `S004_expt6A`; `Customer` and `Loan`; views and before/after insert, update, and delete triggers | [EXP 6 docx](DBMS/EXP_6_DBMS_LAB_6_30_SEPTEMBER_2026.docx) |
| [Lab 8](DBMS/DBMS_LAB_8_07_OCTOBER_2026.sql) | `S004_expt8`; transaction control: `COMMIT`, `ROLLBACK`, savepoints | [EXP 8 docx](DBMS/EXP_8_DBMS_LAB_8_07_OCTOBER_2026.docx) |

Each script creates its own database, so the labs are independent of one another rather than building on a single schema.

The remaining files are the submitted write-ups: `S004_AARYAN_RAORANE_WRITEUP_DBMS_EXPT_1.pdf` through `EXPT_4` and `EXPT_6`/`EXPT_7`, the combined `S004_AARYAN_RAORANE_DBMS_EXPT_1_TO_4.pdf`, and the compiled `S004_AARYAN_RAORANE.docx`/`.pdf`.

## Saturn V 3D

`saturnv-3d/` is a standalone web project rather than coursework: a scroll-driven teardown of NASA's Saturn V, built with React, TypeScript, three.js and GSAP. Scrolling runs the camera from the launch escape tower down to the F-1 engines, and each of the eight vehicle sections separates and highlights as it comes into view.

It is independent of everything else in this repository and has its own toolchain and its own `package.json`. See [`saturnv-3d/REMAINING-WORK.md`](saturnv-3d/REMAINING-WORK.md) for its architecture, conventions, model pipeline and current state.

The NASA model is public domain and is processed by a script into eight named `part_*` nodes, so the geometry on screen and the text describing it cannot drift apart.

## Getting started

### Python

Install Python 3 with Jupyter and the libraries the notebooks import:

```bash
python -m pip install jupyter numpy pandas matplotlib seaborn scipy scikit-learn
jupyter notebook
```

Open a notebook from `PYTHON/` and run its cells from top to bottom.

- Lectures 01-08 and the experiment notebooks 1-4 and 8 use only the Python standard library.
- NumPy is needed for Lectures 09-10 and Experiment 5; Pandas for Lectures 11-14 and Experiments 6 and 7; Matplotlib and Seaborn for Lecture 14 (visualization) and Experiment 13.
- Run Jupyter from inside `PYTHON/` so relative CSV paths resolve.
- Lecture 14 (visualization) and Experiment 7 call `seaborn.load_dataset` and `sklearn.datasets`, which need a network connection on first use.
- Experiment 7 imports `sklearn.datasets.load_boston`, which was removed in scikit-learn 1.2. That one cell fails on current scikit-learn versions; pin an older release or skip it.

### C

The programs include `conio.h` and calls commonly associated with Turbo C (`clrscr`, `getch`, `void main`). A modern GCC installation may reject them. Use a compatible classroom environment, or replace the console-specific calls before compiling with a modern compiler.

For a compiler that provides those headers, the general command is:

```bash
gcc "DATA STRUCTURE/CODES/CQUEUE.C" -o cqueue
```

The `.C` extension may cause a compiler to treat the file as C++; use an explicit C language option where appropriate, for example `gcc -x c ...`, and test each program independently.

### MySQL

Connect to MySQL and run any script on its own; each creates its own database:

```sql
SOURCE DBMS/DBMS_LAB_1_12_AUGUST_2026.sql;
SOURCE DBMS/DBMS_LAB_4_10_SEPTEMBER_2026.sql;
```

Review the statements before running them on a shared server: the scripts create databases, alter tables, and insert sample data.

### Saturn V 3D

Requires Node 20 or newer.

```bash
cd saturnv-3d
npm ci
npm run dev
```

The generated model is committed, so no download or extra setup is needed. `npm run typecheck`, `npm run lint`, `npm run test` and `npm run build` are the automated gates; the 3D view itself still needs checking in a browser, and [`saturnv-3d/REMAINING-WORK.md`](saturnv-3d/REMAINING-WORK.md) lists what that involves. The `npm run model:*` scripts re-run the model pipeline if the source GLB changes.

## Suggested study order

1. Work through the Python lecture notebooks from 01 to 05.
2. Continue with the collection notebooks 07 and 08, then the NumPy notebook (09-10).
3. Move to Pandas (11-13), then data cleaning and visualization (14), functions (15), and modules/exceptions (16).
4. Use the practical sheets as problem lists and check your solutions against the matching experiment notebooks.
5. Read `A1_DS_ST.C`, then compare linear and circular queues before studying `LINKEDLI.C`; finish with the linked-list stack/queue, `DOUBLYLL.C`, and `BINSEARC.C`.
6. Run the DBMS lab scripts in the order of their dates and inspect the schema, queries, procedures, views, and transactions.

## Notes

- This is an educational coursework repository maintained by Aaryan Raorane (S004).
- Filenames and dates reflect the classwork and lab submission organization; the `Exp`/`Expt` and lab/experiment numbering inconsistencies are original to those submissions.
- `PYTHON/.ipynb_checkpoints/` is generated notebook-editor metadata. It is currently still tracked in git but new checkpoints are ignored.
- The repository has not been presented as a single tested build; validate individual notebooks, C programs, and SQL statements in the environment where you plan to use them.
- `saturnv-3d/` is unrelated to the coursework and has its own independent toolchain.

## Links

- [Python notebooks and datasets](PYTHON/)
- [Data structure programs and write-ups](DATA%20STRUCTURE/)
- [DBMS scripts and lab documents](DBMS/)
- [Saturn V 3D](saturnv-3d/)
