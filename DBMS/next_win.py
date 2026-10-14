from tkinter import *
import mysql.connector

# Establish connection (updated to your 'college' database setup)
conn = mysql.connector.connect(
    user='root',
    password='root',
    host='localhost',
    database='college'
)
cursor = conn.cursor()


class NextWindow:
    def __init__(self, root):
        self.root = root
        self.f = Frame(root, height=800, width=800)
        self.f.pack(fill=BOTH, expand=True)

        # FIXED: Separate control frame for the button to avoid geometry manager mixing conflicts
        self.control_frame = Frame(self.f)
        self.control_frame.pack(side=TOP, pady=10)

        self.b1 = Button(self.control_frame, text="Show", command=self.display)
        self.b1.pack()

        # FIXED: Separate dedicated frame for dynamic grid entries
        self.data_frame = Frame(self.f)
        self.data_frame.pack(side=TOP, fill=BOTH, expand=True, padx=10, pady=10)

        # Keep track of generated entries to clear them on refresh
        self.current_entries = []

    def display(self):
        print("----------View records-----------")

        # Clear previous entries if "Show" is clicked more than once
        for entry in self.current_entries:
            entry.destroy()
        self.current_entries.clear()

        try:
            cursor.execute("SELECT * FROM student LIMIT 0, 10")
            rows = cursor.fetchall()

            for i, row in enumerate(rows):
                for j, val in enumerate(row):
                    e = Entry(self.data_frame, width=12, fg='green', justify='center')
                    e.grid(row=i, column=j, padx=2, pady=2)
                    e.insert(END, str(val))
                    e.config(state='readonly')  # Make records read-only for clean viewing
                    self.current_entries.append(e)

        except mysql.connector.Error as err:
            print(f"Error: unable to fetch data - {err}")


root = Tk()
root.title("Welcome To Next Window")
root.geometry("800x800")
obj = NextWindow(root)
root.mainloop()
