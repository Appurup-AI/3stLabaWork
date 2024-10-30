//StudentButton component
const StudentButton = ({ student, deleteStudent, updateStudent }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    age: student.age,
    email: student.email,
  });

  //function to confirm to delete a student
  const handleDelete = () => {
    Alert.alert(
      "Attention!",
      "Are you sure you want to delete the student ?",
      [
        { text: "No", onPress: () => {}, style: "cancel" },
        { text: "Yes", onPress: () => deleteStudent(student.id) },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    updateStudent(
      student.id,
      editedStudent.firstName,
      editedStudent.lastName,
      editedStudent.age,
      editedStudent.email
    );
    setIsEditing(false);
  };

  return (
    <View>
      <Pressable
        style={styles.studentButton}
        onPress={() => {
          setSelectedStudent(
            selectedStudent === student.id ? null : student.id
          );
        }}
      >
        <Text style={styles.studentText}>
          {" "}
          {student.id} - {student.lastName}
        </Text>
        {selectedStudent === student.id && (
          <View style={styles.actions}>
            <AntDesign
              name="edit"
              size={18}
              color="blue"
              onPress={() => setIsEditing(true)}
              style={styles.icon}
            />
            <AntDesign
              name="delete"
              size={18}
              color="red"
              onPress={handleDelete}
              style={styles.icon}
            />
          </View>
        )}
      </Pressable>
      {selectedStudent === student.id && !isEditing && (
        <View style={styles.studentContent}>
          <Text>First name : {student.firstName}</Text>
          <Text>Last name : {student.lastName}</Text>
          <Text>Age : {student.age}</Text>
          <Text>email : {student.email}</Text>
        </View>
      )}
      {selectedStudent === student.id && isEditing && (
        <StudentForm
          student={editedStudent}
          setStudent={setEditedStudent}
          onSave={handleEdit}
          setShowForm={setIsEditing}
        />
      )}
    </View>
  );
};

//StudentForm component
const StudentForm = ({ student, setStudent, onSave, setShowForm }) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="First name"
        value={student.firstName}
        onChangeText={(text) => setStudent({ ...student, firstName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={student.lastName}
        onChangeText={(text) => setStudent({ ...student, lastName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={student.age}
        onChangeText={(text) => setStudent({ ...student, age: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        value={student.email}
        onChangeText={(text) => setStudent({ ...student, email: text })}
        keyboardType="email-address"
      />

      <Pressable onPress={onSave} style={styles.saveButton}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
      <Pressable onPress={() => setShowForm(false)} style={styles.cancelButton}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>
    </View>
  );
};
const Content = () => {
  const db = useSQLiteContext();
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [student, setStudent] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
  });

  const handleSave = () => {
    if (
      student.firstName.length === 0 ||
      student.lastName.length === 0 ||
      student.age === 0 ||
      student.email.length === 0
    ) {
      Alert.alert("Attention", "Please enter all the data !");
    } else {
      addStudent(student);
      setStudent({ id: 0, firstName: "", lastName: "", age: 0, email: "" });
      setShowForm(false);
    }
  };

  //function to get all the students
  const getStudents = async () => {
    try {
      const allRows = await db.getAllAsync("SELECT * FROM students");
      setStudents(allRows);
    } catch (error) {
      console.log("Error while loading students : ", error);
    }
  };

  //function to add a student
  const addStudent = async (newStudent) => {
    try {
      const statement = await db.prepareAsync(
        "INSERT INTO students (firstName, lastName, age, email) VALUES (?,?,?,?)"
      );
      await statement.executeAsync([
        newStudent.firstName,
        newStudent.lastName,
        newStudent.age,
        newStudent.email,
      ]);
      await getStudents();
    } catch (error) {
      console.log("Error while adding student : ", error);
    }
  };

  //function to delete all students
  const deleteAllStudents = async () => {
    try {
      await db.runAsync("DELETE FROM students");
      await getStudents();
    } catch (error) {
      console.log("Error while deleting all the students : ", error);
    }
  };

  //function to confirm deleting all students
  const confirmDeleteAll = () => {
    Alert.alert(
      "Attention!",
      "Are you sure you want to delete all the students ?",
      [
        { text: "No", onPress: () => {}, style: "cancel" },
        { text: "Yes", onPress: deleteAllStudents },
      ],
      { cancelable: true }
    );
  };

  //function to update a student
  const updateStudent = async (
    studentId,
    newFirstName,
    newLastName,
    newAge,
    newEmail
  ) => {
    try {
      await db.runAsync(
        "UPDATE students SET firstName = ?, lastName = ?, age = ?, email = ? WHERE id = ?",
        [newFirstName, newLastName, newAge, newEmail, studentId]
      );
      await getStudents();
    } catch (error) {
      console.log("Error while updating student");
    }
  };

  //function to delete a student
  const deleteStudent = async (id) => {
    try {
      await db.runAsync("DELETE FROM students WHERE id = ?", [id]);
      await getStudents();
    } catch (error) {
      console.log("Error while deleting the student : ", error);
    }
  };

  //get all the students at  the first render of the app
  useEffect(() => {
    //addStudent({firstName:'Lucas', lastName:'Smith', age: 22, email: 'lucas.smith@ex.com'})
    //deleteAllStudents();
    getStudents();
  }, []);

  return (
    <View style={styles.contentContainer}>
      {students.length === 0 ? (
        <Text>Никого нет!</Text>
      ) : (
        <FlatList
          data={students}
          renderItem={({ item }) => (
            <StudentButton
              student={item}
              deleteStudent={deleteStudent}
              updateStudent={updateStudent}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      {showForm && (
        <StudentForm
          student={student}
          setStudent={setStudent}
          onSave={handleSave}
          setShowForm={setShowForm}
        />
      )}
      <View style={styles.iconsContent}>
        <AntDesign
          name="pluscircleo"
          size={24}
          color="blue"
          onPress={() => setShowForm(true)}
          style={styles.icon}
        />
        <AntDesign
          name="deleteusergroup"
          size={24}
          color="red"
          onPress={confirmDeleteAll}
          style={styles.icon}
        />
      </View>
    </View>
  );
};