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


class NextWindow:
    def __init__(self, root):
        self.root = root
        self.f = Frame(root)
        self.f.pack(fill=BOTH, expand=True)

        # Control panel layout header
        self.control_frame = Frame(self.f)
        self.control_frame.pack(side=TOP, pady=15)

        self.b1 = Button(self.control_frame, text="Load / Refresh Records", command=self.display, bg="green",
                         fg="white")
        self.b1.pack()

        # Database display grid frame
        self.data_frame = Frame(self.f)
        self.data_frame.pack(side=TOP, fill=BOTH, expand=True, padx=15, pady=10)

        self.row_trackers = []
        self.display()  # Auto-load contents upon window display opening

    def display(self):
        # Clear previous UI references out completely
        for widgets in self.data_frame.winfo_children():
            widgets.destroy()
        self.row_trackers.clear()

        try:
            # READ OPERATION (SELECT)
            cursor.execute("SELECT g_id, g_type, s_id, t_id FROM grades LIMIT 0, 10")
            rows = cursor.fetchall()

            if not rows:
                lbl = Label(self.data_frame, text="No records found in the 'grades' table.", fg="red")
                lbl.pack()
                return

            # Display header column elements
            headers = ["g_id", "g_type", "s_id", "t_id", "Actions"]
            for col_idx, text in enumerate(headers):
                lbl = Label(self.data_frame, text=text, font=('Arial', 10, 'bold'), borderwidth=1, relief="solid",
                            width=12)
                lbl.grid(row=0, column=col_idx, padx=2, pady=5)

            # Generate grid row entries interactively
            for i, row in enumerate(rows, start=1):
                entries_in_row = []

                # Render database contents as interactive row items
                for j, val in enumerate(row):
                    e = Entry(self.data_frame, width=12, fg='green', justify='center')
                    e.grid(row=i, column=j, padx=2, pady=2)
                    e.insert(END, str(val))
                    if j == 0:  # g_id is primary key, disable editing on it to preserve key constraints
                        e.config(state='readonly')
                    entries_in_row.append(e)

                # UPDATE and DELETE dynamic operations injection handlers
                btn_frame = Frame(self.data_frame)
                btn_frame.grid(row=i, column=4, padx=5)

                up_btn = Button(btn_frame, text="Update", size=6, bg="orange", font=('Arial', 8),
                                command=lambda r=entries_in_row: self.update_record(r))
                up_btn.pack(side=LEFT, padx=2)

                del_btn = Button(btn_frame, text="Delete", size=6, bg="red", fg="white", font=('Arial', 8),
                                 command=lambda target_id=row[0]: self.delete_record(target_id))
                del_btn.pack(side=LEFT, padx=2)

                self.row_trackers.append(entries_in_row)

        except mysql.connector.Error as err:
            print(f"Error fetching data: {err}")

    def update_record(self, row_entries):
        # UPDATE OPERATION
        g_id = int(row_entries[0].get())
        g_type = row_entries[1].get()
        s_id = int(row_entries[2].get()) if row_entries[2].get().isdigit() else 0
        t_id = int(row_entries[3].get()) if row_entries[3].get().isdigit() else 0

        sql = "UPDATE grades SET g_type = %s, s_id = %s, t_id = %s WHERE g_id = %s"
        try:
            cursor.execute(sql, (g_type, s_id, t_id, g_id))
            conn.commit()
            messagebox.showinfo("Success", f"Record g_id {g_id} updated successfully!")
            self.display()
        except mysql.connector.Error as err:
            conn.rollback()
            messagebox.showerror("Error", f"Update failed: {err}")

    def delete_record(self, g_id):
        # DELETE OPERATION
        if messagebox.askyesno("Confirm Delete", f"Are you sure you want to permanently delete record g_id {g_id}?"):
            sql = "DELETE FROM grades WHERE g_id = %s"
            try:
                cursor.execute(sql, (g_id,))
                conn.commit()
                messagebox.showinfo("Deleted", "Record removed successfully.")
                self.display()
            except mysql.connector.Error as err:
                conn.rollback()
                messagebox.showerror("Error", f"Deletion failed: {err}")


if __name__ == "__main__":
    root = Tk()
    root.title("Welcome To Next Window - Manage Records")
    root.geometry("650x500")
    obj = NextWindow(root)
    root.mainloop()
