from tkinter import *
import tkinter.messagebox as messagebox
import mysql.connector

# Unified connection config for AARYAN_RAORANE_S004
conn = mysql.connector.connect(
    user='root',
    password='pass@123',
    host='localhost',
    database='AARYAN_RAORANE_S004'
)
cursor = conn.cursor()

class First:
    def __init__(self, root):
        self.root = root
        self.f = Frame(root, height=500, width=500)
        self.f.pack()

        # Input Form Labels
        self.l1 = Label(self.f, text='g_id :')
        self.l2 = Label(self.f, text='g_type :')
        self.l3 = Label(self.f, text='s_id : ')
        self.l4 = Label(self.f, text='t_id :')

        self.e1 = Entry(self.f, width=18)
        self.e2 = Entry(self.f, width=18)
        self.e3 = Entry(self.f, width=18)
        self.e4 = Entry(self.f, width=18)

        # Action Button
        self.b1 = Button(self.f, text="Submit & View All", command=self.display, bg="blue", fg="white")

        # Layout Setup
        self.l1.place(x=50, y=30)
        self.e1.place(x=200, y=30)
        self.l2.place(x=50, y=60)
        self.e2.place(x=200, y=60)
        self.l3.place(x=50, y=90)
        self.e3.place(x=200, y=90)
        self.l4.place(x=50, y=130)
        self.e4.place(x=200, y=130)
        self.b1.place(x=200, y=170)

    def display(self):
        # Data sanitization
        g_id = int(self.e1.get()) if self.e1.get().isdigit() else 0
        g_type = self.e2.get()
        s_id = int(self.e3.get()) if self.e3.get().isdigit() else 0
        t_id = int(self.e4.get()) if self.e4.get().isdigit() else 0

        if g_id == 0:
            messagebox.showerror("Error", "g_id must be a valid non-zero integer.")
            return

        # INSERT OPERATION (CREATE)
        sql = "INSERT INTO grades (g_id, g_type, s_id, t_id) VALUES (%s, %s, %s, %s)"
        values = (g_id, g_type, s_id, t_id)

        try:
            cursor.execute(sql, values)
            conn.commit()
            messagebox.showinfo("Success", "Grades Data Inserted Successfully!")
            self.next_win()
        except mysql.connector.Error as err:
            conn.rollback()
            messagebox.showerror("Database Error", f"Failed to insert record: {err}\n(Make sure s_id and t_id exist in their parent tables first!)")

    def next_win(self):
        self.root.destroy()
        # Dynamically launches file 2
        import next_win

if __name__ == "__main__":
    root = Tk()
    root.title("Welcome To Tkinter GUI Programme")
    root.geometry("500x300")
    obj = First(root)
    root.mainloop()
