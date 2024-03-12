import sqlite3

connection = sqlite3.connect("user.db")

cursor = connection.cursor()

table_info = """
Create table USER(NAME VARCHAR(25), BALANCE INT, USERID VARCHAR(50));
"""

cursor.execute(table_info)

cursor.execute('''Insert Into USER values('John', '1000', 'john8844')''')
cursor.execute('''Insert Into USER values('Daniel', '1500', 'dani8844')''')
cursor.execute('''Insert Into USER values('Ram', '500', 'ram8844')''')

data = cursor.execute('''Select * From USER''')

for row in data:
    print(row)


connection.commit()
connection.close()