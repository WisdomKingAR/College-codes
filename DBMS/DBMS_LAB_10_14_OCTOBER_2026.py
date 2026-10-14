from tkinter import *
import mysql.connector

conn = mysql.connector.connect(user='root', password='root', host='localhost', database='college')
cursor=conn.cursor()
class First:

   def __init__(self,root):
       self.f=Frame(root,height=500,width=500)
       self.f.pack()
       self.l1=Label(text='First Name :')
       self.l2=Label(text='Last Name :')
       self.l3=Label(text='Age')
       self.l4=Label(text='Tel No:')
       self.e1=Entry(self.f,width=18)
       self.e2=Entry(self.f,width=18)
       self.e3=Entry(self.f,width=18)
       self.e4=Entry(self.f,width=18)
       self.b1=Button(self.f,text="Submit",command=self.display)
       self.l1.place(x=50,y=30)
       self.e1.place(x=200,y=30)
       self.l2.place(x=50,y=60)
       self.e2.place(x=200,y=60)
       self.l3.place(x=50,y=90)
       self.e3.place(x=200,y=90)
       self.l4.place(x=50,y=130)
       self.e4.place(x=200,y=130)
       self.b1.place(x=200,y=150)
   def display(self):
       str1=self.e1.get()
       str2=self.e2.get()
       str3=int(self.e3.get())
       str4=int(self.e4.get())
       sql="Insert into student(f_name,l_name,age,tel_no)values('%s','%s','%d','%d')"%(str1,str2,str3,str4)

       try:
           cursor.execute(sql)
           conn.commit()
       except:
           conn.rollback()
       print("Data Inserted")
       conn.close()
       self.next_win()

   def next_win(self):
       root.destroy()
       import next_win


root=Tk()
root.title("Welcome To Tkinter GUI Programme")
obj=First(root)
root.mainloop()